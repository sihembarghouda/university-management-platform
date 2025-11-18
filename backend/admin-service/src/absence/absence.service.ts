import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Absence, StatutAbsence } from './absence.entity';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { JustifierAbsenceDto } from './dto/justifier-absence.dto';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepo: Repository<Absence>,
  ) {}

  // CRUD de base
  async create(createDto: CreateAbsenceDto): Promise<Absence> {
    const absence = this.absenceRepo.create(createDto);
    return await this.absenceRepo.save(absence);
  }

  async findAll(): Promise<Absence[]> {
    return await this.absenceRepo.find({
      order: { dateAbsence: 'DESC', createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Absence> {
    const absence = await this.absenceRepo.findOne({ where: { id } });
    if (!absence) {
      throw new NotFoundException(`Absence #${id} non trouvée`);
    }
    return absence;
  }

  async update(id: number, updateDto: UpdateAbsenceDto): Promise<Absence> {
    const absence = await this.findOne(id);
    Object.assign(absence, updateDto);
    return await this.absenceRepo.save(absence);
  }

  async remove(id: number): Promise<void> {
    const absence = await this.findOne(id);
    await this.absenceRepo.remove(absence);
  }

  // Fonctionnalités spécifiques
  
  // Justifier une absence
  async justifierAbsence(id: number, justificationDto: JustifierAbsenceDto): Promise<Absence> {
    const absence = await this.findOne(id);
    
    absence.statut = StatutAbsence.EN_ATTENTE;
    absence.typeJustificatif = justificationDto.typeJustificatif;
    absence.motifJustification = justificationDto.motifJustification;
    if (justificationDto.pieceJustificative) {
      absence.pieceJustificative = justificationDto.pieceJustificative;
    }
    absence.dateJustification = justificationDto.dateJustification || new Date();
    
    return await this.absenceRepo.save(absence);
  }

  // Valider une justification
  async validerJustification(id: number, accepter: boolean): Promise<Absence> {
    const absence = await this.findOne(id);
    
    absence.statut = accepter ? StatutAbsence.JUSTIFIEE : StatutAbsence.REFUSEE;
    
    return await this.absenceRepo.save(absence);
  }

  // Planifier un rattrapage
  async planifierRattrapage(id: number, dateRattrapage: Date, heureRattrapage: string): Promise<Absence> {
    const absence = await this.findOne(id);
    
    absence.rattrapage = true;
    absence.dateRattrapage = dateRattrapage;
    absence.heureRattrapage = heureRattrapage;
    absence.rattrapageEffectue = false;
    
    return await this.absenceRepo.save(absence);
  }

  // Marquer un rattrapage comme effectué
  async marquerRattrapageEffectue(id: number): Promise<Absence> {
    const absence = await this.findOne(id);
    
    absence.rattrapageEffectue = true;
    
    return await this.absenceRepo.save(absence);
  }

  // Obtenir les absences par étudiant
  async getAbsencesByEtudiant(etudiantId: number): Promise<Absence[]> {
    return await this.absenceRepo.find({
      where: { etudiantId },
      order: { dateAbsence: 'DESC' }
    });
  }

  // Obtenir les absences par matière
  async getAbsencesByMatiere(matiereId: number): Promise<Absence[]> {
    return await this.absenceRepo.find({
      where: { matiereId },
      order: { dateAbsence: 'DESC' }
    });
  }

  // Calculer le total d'heures d'absence par étudiant
  async getTotalHeuresAbsence(etudiantId: number, matiereId?: number): Promise<number> {
    const query = this.absenceRepo.createQueryBuilder('absence')
      .select('SUM(absence.nbHeures)', 'total')
      .where('absence.etudiantId = :etudiantId', { etudiantId })
      .andWhere('absence.statut != :statut', { statut: StatutAbsence.JUSTIFIEE });

    if (matiereId) {
      query.andWhere('absence.matiereId = :matiereId', { matiereId });
    }

    const result = await query.getRawOne();
    return Number(result.total) || 0;
  }

  // Vérifier si un étudiant risque l'élimination (seuil: 25% d'absences)
  async verifierRisqueElimination(etudiantId: number, matiereId: number, totalHeuresMatiere: number = 40): Promise<{
    risque: boolean;
    totalHeures: number;
    pourcentage: number;
    seuilElimination: number;
  }> {
    const totalHeures = await this.getTotalHeuresAbsence(etudiantId, matiereId);
    const pourcentage = (totalHeures / totalHeuresMatiere) * 100;
    const seuilElimination = 25; // 25% d'absences = élimination
    
    return {
      risque: pourcentage >= seuilElimination,
      totalHeures,
      pourcentage: Math.round(pourcentage * 10) / 10,
      seuilElimination
    };
  }

  // Obtenir les étudiants à risque d'élimination
  async getEtudiantsARisque(seuilPourcentage: number = 25): Promise<any[]> {
    const absences = await this.absenceRepo.find({
      where: { statut: StatutAbsence.NON_JUSTIFIEE }
    });

    // Grouper par étudiant et matière
    const groupes = absences.reduce((acc, absence) => {
      const key = `${absence.etudiantId}-${absence.matiereId}`;
      if (!acc[key]) {
        acc[key] = {
          etudiantId: absence.etudiantId,
          etudiantNom: absence.etudiantNom,
          etudiantPrenom: absence.etudiantPrenom,
          matiereId: absence.matiereId,
          matiereNom: absence.matiereNom,
          totalHeures: 0,
          absences: []
        };
      }
      acc[key].totalHeures += absence.nbHeures;
      acc[key].absences.push(absence);
      return acc;
    }, {});

    // Filtrer ceux qui dépassent le seuil
    const totalHeuresMatiere = 40; // À adapter selon votre système
    return Object.values(groupes)
      .filter((groupe: any) => {
        const pourcentage = (groupe.totalHeures / totalHeuresMatiere) * 100;
        return pourcentage >= seuilPourcentage;
      })
      .map((groupe: any) => ({
        ...groupe,
        pourcentage: Math.round((groupe.totalHeures / totalHeuresMatiere) * 100 * 10) / 10
      }));
  }

  // Envoyer une alerte d'élimination
  async envoyerAlerteElimination(id: number): Promise<Absence> {
    const absence = await this.findOne(id);
    
    absence.alerteEliminationEnvoyee = true;
    
    // Ici vous pouvez ajouter l'envoi d'email ou notification
    console.log(`📧 Alerte d'élimination envoyée pour l'absence #${id}`);
    
    return await this.absenceRepo.save(absence);
  }

  // Obtenir les statistiques d'absences
  async getStatistiques(): Promise<{
    total: number;
    nonJustifiees: number;
    justifiees: number;
    enAttente: number;
    avecRattrapage: number;
  }> {
    const [total, nonJustifiees, justifiees, enAttente, avecRattrapage] = await Promise.all([
      this.absenceRepo.count(),
      this.absenceRepo.count({ where: { statut: StatutAbsence.NON_JUSTIFIEE } }),
      this.absenceRepo.count({ where: { statut: StatutAbsence.JUSTIFIEE } }),
      this.absenceRepo.count({ where: { statut: StatutAbsence.EN_ATTENTE } }),
      this.absenceRepo.count({ where: { rattrapage: true } }),
    ]);

    return {
      total,
      nonJustifiees,
      justifiees,
      enAttente,
      avecRattrapage
    };
  }
}
