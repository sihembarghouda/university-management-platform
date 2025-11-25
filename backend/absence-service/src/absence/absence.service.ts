import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Absence, StatutAbsence } from './absence.entity';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { JustifierAbsenceDto } from './dto/justifier-absence.dto';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepo: Repository<Absence>,
    private readonly httpService: HttpService,
  ) {}

  async create(createDto: CreateAbsenceDto): Promise<Absence> {
    const absence: any = this.absenceRepo.create(createDto as any);
    // ensure defaults: if sujet is 'enseignant' and enseignantId present, mark as EN_ATTENTE (request to director)
    if ((absence as any).sujet === 'enseignant') {
      absence.statut = StatutAbsence.EN_ATTENTE;
      absence.rattrapage = false;
    }
    try {
      const savedAbsence = await this.absenceRepo.save(absence);

      // Send notification if it's a teacher absence
      if ((savedAbsence as any).sujet === 'enseignant') {
        try {
          await this.sendAbsenceNotification(savedAbsence);
        } catch (notifError) {
          console.error('Erreur lors de l\'envoi de la notification d\'absence:', notifError);
          // Don't fail the absence creation if notification fails
        }
      }

      return savedAbsence;
    } catch (err) {
      console.error('AbsenceService.create error:', err);
      throw new InternalServerErrorException('Erreur lors de la création de l\'absence');
    }
  }

  private async sendAbsenceNotification(absence: any): Promise<void> {
    try {
      // Get teacher info from admin-service
      const enseignantResponse = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/enseignant/${absence.enseignantId}`)
      );
      const enseignant = enseignantResponse.data;

      // Get matiere info
      const matiereResponse = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/matiere/${absence.matiereId}`)
      );
      const matiere = matiereResponse.data;

      // Get director for the department
      const directeursResponse = await firstValueFrom(
        this.httpService.get('http://localhost:3002/enseignant')
      );
      const directeurs = directeursResponse.data.filter(
        (e: any) => e.departement?.id === enseignant.departement?.id && e.role === 'directeur_departement'
      );

      if (directeurs.length === 0) {
        console.warn('Aucun directeur trouvé pour le département:', enseignant.departement?.id);
        return;
      }

      const directeur = directeurs[0];

      // Send notification
      await firstValueFrom(
        this.httpService.post('http://localhost:3002/api/notifications/absence-enseignant', {
          enseignantId: absence.enseignantId,
          directeurId: directeur.id,
          enseignantNom: `${enseignant.nom} ${enseignant.prenom}`,
          matiereNom: matiere.nom,
          date: absence.dateAbsence,
          motif: absence.motif || 'Absence enseignante',
        })
      );

      console.log('🔔 Notification d\'absence envoyée au directeur:', directeur.nom);
    } catch (error) {
      console.error('Erreur dans sendAbsenceNotification:', error);
      throw error;
    }
  }

  async findAll(filter?: { sujet?: 'etudiant'|'enseignant' }): Promise<Absence[]> {
    if (filter?.sujet) {
      return await this.absenceRepo.find({ where: { sujet: filter.sujet }, order: { dateAbsence: 'DESC', createdAt: 'DESC' } });
    }
    return await this.absenceRepo.find({ order: { dateAbsence: 'DESC', createdAt: 'DESC' } });
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

  async validerJustification(id: number, accepter: boolean): Promise<Absence> {
    const absence = await this.findOne(id);
    absence.statut = accepter ? StatutAbsence.JUSTIFIEE : StatutAbsence.REFUSEE;
    return await this.absenceRepo.save(absence);
  }

  async planifierRattrapage(id: number, dateRattrapage: Date, heureRattrapage: string): Promise<Absence> {
    const absence = await this.findOne(id);
    absence.rattrapage = true;
    absence.dateRattrapage = dateRattrapage;
    absence.heureRattrapage = heureRattrapage;
    absence.rattrapageEffectue = false;
    return await this.absenceRepo.save(absence);
  }

  async marquerRattrapageEffectue(id: number): Promise<Absence> {
    const absence = await this.findOne(id);
    absence.rattrapageEffectue = true;
    return await this.absenceRepo.save(absence);
  }

  async getAbsencesByEtudiant(etudiantId: number): Promise<Absence[]> {
    return await this.absenceRepo.find({
      where: { etudiantId },
      order: { dateAbsence: 'DESC' }
    });
  }

  async getAbsencesByMatiere(matiereId: number): Promise<Absence[]> {
    return await this.absenceRepo.find({
      where: { matiereId },
      order: { dateAbsence: 'DESC' }
    });
  }

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

  async verifierRisqueElimination(etudiantId: number, matiereId: number, totalHeuresMatiere: number = 40) {
    const totalHeures = await this.getTotalHeuresAbsence(etudiantId, matiereId);
    const pourcentage = (totalHeures / totalHeuresMatiere) * 100;
    const seuilElimination = 25;
    return {
      risque: pourcentage >= seuilElimination,
      totalHeures,
      pourcentage: Math.round(pourcentage * 10) / 10,
      seuilElimination
    };
  }

  async getEtudiantsARisque(seuilPourcentage: number = 25): Promise<any[]> {
    const absences = await this.absenceRepo.find({ where: { statut: StatutAbsence.NON_JUSTIFIEE } });
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
    const totalHeuresMatiere = 40;
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

  async envoyerAlerteElimination(id: number): Promise<Absence> {
    const absence = await this.findOne(id);
    absence.alerteEliminationEnvoyee = true;
    console.log(`📧 Alerte d'élimination envoyée pour l'absence #${id}`);
    return await this.absenceRepo.save(absence);
  }

  // Statistiques d'absences
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
