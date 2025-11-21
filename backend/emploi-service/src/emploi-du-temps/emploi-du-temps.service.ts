import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploiDuTemps } from './entities/emploi-du-temps.entity';
import { CreateEmploiDto } from './dto/create-emploi.dto';
import { UpdateEmploiDto } from './dto/update-emploi.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class EmploiDuTempsService {
  constructor(
    @InjectRepository(EmploiDuTemps)
    private readonly emploiRepo: Repository<EmploiDuTemps>,
    private readonly adminService: AdminService,
  ) {}

  async create(dto: CreateEmploiDto): Promise<EmploiDuTemps> {
    const { classeId, enseignantId, salleId, matiereId, date, heureDebut, heureFin, semestre } = dto;

    if (![1, 2].includes(semestre)) {
      throw new BadRequestException('Le semestre doit être 1 ou 2.');
    }

    await this.adminService.getEnseignant(enseignantId);
    await this.adminService.getSalle(salleId);
    await this.adminService.getClasse(classeId);
    if (matiereId) await this.adminService.getMatiere(matiereId);

    const conflict = await this.emploiRepo.createQueryBuilder('emploi')
      .where('emploi.date = :date', { date })
      .andWhere('emploi.semestre = :semestre', { semestre })
      .andWhere('(emploi.salleId = :salleId OR emploi.enseignantId = :enseignantId OR emploi.classeId = :classeId)', {
        salleId, enseignantId, classeId,
      })
      .andWhere('emploi.heureDebut < :heureFin AND emploi.heureFin > :heureDebut', {
        heureDebut, heureFin,
      })
      .getOne();

    if (conflict) {
      let conflictType = '';
      let timeInfo = `de ${conflict.heureDebut.slice(0, 5)} à ${conflict.heureFin.slice(0, 5)}`;
      if (conflict.salleId === salleId && conflict.enseignantId === enseignantId) {
        const salle = await this.adminService.getSalle(salleId);
        const enseignant = await this.adminService.getEnseignant(enseignantId);
        conflictType = `la salle '${salle.nom}' et l'enseignant '${enseignant.nom} ${enseignant.prenom}'`;
      } else if (conflict.salleId === salleId) {
        const salle = await this.adminService.getSalle(salleId);
        conflictType = `la salle '${salle.nom}'`;
      } else if (conflict.enseignantId === enseignantId) {
        const enseignant = await this.adminService.getEnseignant(enseignantId);
        conflictType = `l'enseignant '${enseignant.nom} ${enseignant.prenom}'`;
      } else if (conflict.classeId === classeId) {
        const classe = await this.adminService.getClasse(classeId);
        conflictType = `la classe '${classe.nom}'`;
      }
      throw new BadRequestException(`Conflit détecté : ${conflictType} est/sont déjà occupé(s) ${timeInfo}.`);
    }

    const emploi = this.emploiRepo.create(dto);
    return this.emploiRepo.save(emploi);
  }

  async getScheduleForClass(classeId: number, semestre: number) {
    await this.adminService.getClasse(classeId);

    const emplois = await this.emploiRepo.find({
      where: { classeId, semestre },
      order: { date: 'ASC', heureDebut: 'ASC' }
    });

    return this.groupByDay(emplois);
  }

  async getScheduleForEtudiant(etudiantId: number, semestre: number) {
    // Récupérer l'étudiant pour obtenir sa classe
    const etudiant = await this.adminService.getEtudiant(etudiantId);
    
    if (!etudiant.classe || !etudiant.classe.id) {
      throw new NotFoundException(`L'étudiant n'est pas assigné à une classe`);
    }

    // Retourner l'emploi du temps de sa classe
    return this.getScheduleForClass(etudiant.classe.id, semestre);
  }

  async getScheduleForEnseignant(enseignantId: number, semestre: number) {
    await this.adminService.getEnseignant(enseignantId);

    const emplois = await this.emploiRepo.find({
      where: { enseignantId, semestre },
      order: { date: 'ASC', heureDebut: 'ASC' }
    });

    return this.groupByDay(emplois);
  }

  async getScheduleForSalle(salleId: number, semestre: number) {
    await this.adminService.getSalle(salleId);

    const emplois = await this.emploiRepo.find({
      where: { salleId, semestre },
      order: { date: 'ASC', heureDebut: 'ASC' }
    });

    return this.groupByDay(emplois);
  }

  private async groupByDay(emplois: EmploiDuTemps[]) {
    const grouped = {};
    for (const emploi of emplois) {
      const jour = new Date(emploi.date).toLocaleDateString('fr-FR', { weekday: 'long' });
      const capitalizedJour = jour.charAt(0).toUpperCase() + jour.slice(1);
      if (!grouped[capitalizedJour]) grouped[capitalizedJour] = [];

      const matiere = await this.adminService.getMatiere(emploi.matiereId);
      const enseignant = await this.adminService.getEnseignant(emploi.enseignantId);
      const salle = await this.adminService.getSalle(emploi.salleId);
      const classe = await this.adminService.getClasse(emploi.classeId);

      grouped[capitalizedJour].push({
        id: emploi.id,
        matiereId: emploi.matiereId,
        enseignantId: emploi.enseignantId,
        salleId: emploi.salleId,
        classeId: emploi.classeId,
        heureDebut: emploi.heureDebut.slice(0, 5),
        heureFin: emploi.heureFin.slice(0, 5),
        matiere: matiere.nom,
        enseignant: `${enseignant.nom} ${enseignant.prenom}`,
        salle: salle.nom,
        classe: classe.nom
      });
    }
    return grouped;
  }

  async update(id: number, dto: UpdateEmploiDto): Promise<EmploiDuTemps> {
    const emploi = await this.emploiRepo.findOne({ where: { id } });
    if (!emploi) {
      throw new NotFoundException(`Emploi du temps avec ID ${id} introuvable`);
    }

    // Validation du semestre si fourni
    if (dto.semestre && ![1, 2].includes(dto.semestre)) {
      throw new BadRequestException('Le semestre doit être 1 ou 2.');
    }

    // Vérification des IDs si fournis
    if (dto.enseignantId) await this.adminService.getEnseignant(dto.enseignantId);
    if (dto.salleId) await this.adminService.getSalle(dto.salleId);
    if (dto.classeId) await this.adminService.getClasse(dto.classeId);
    if (dto.matiereId) await this.adminService.getMatiere(dto.matiereId);

    // Vérification des conflits si date/heure ou ressources sont modifiées
    const dateToCheck = dto.date || emploi.date;
    const heureDebutToCheck = dto.heureDebut || emploi.heureDebut;
    const heureFinToCheck = dto.heureFin || emploi.heureFin;
    const salleToCheck = dto.salleId || emploi.salleId;
    const enseignantToCheck = dto.enseignantId || emploi.enseignantId;
    const classeToCheck = dto.classeId || emploi.classeId;

    const conflict = await this.emploiRepo.createQueryBuilder('emploi')
      .where('emploi.id != :id', { id })
      .andWhere('emploi.date = :date', { date: dateToCheck })
      .andWhere('(emploi.salleId = :salleId OR emploi.enseignantId = :enseignantId OR emploi.classeId = :classeId)', {
        salleId: salleToCheck,
        enseignantId: enseignantToCheck,
        classeId: classeToCheck,
      })
      .andWhere('emploi.heureDebut < :heureFin AND emploi.heureFin > :heureDebut', {
        heureDebut: heureDebutToCheck,
        heureFin: heureFinToCheck,
      })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Conflit détecté : salle, enseignant ou classe déjà occupé.');
    }

    // Mise à jour
    Object.assign(emploi, dto);
    return this.emploiRepo.save(emploi);
  }

  async remove(id: number): Promise<void> {
    const emploi = await this.emploiRepo.findOne({ where: { id } });
    if (!emploi) {
      throw new NotFoundException(`Emploi du temps avec ID ${id} introuvable`);
    }
    await this.emploiRepo.remove(emploi);
  }
}