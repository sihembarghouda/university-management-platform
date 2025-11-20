import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploiDuTemps } from './entities/emploi-du-temps.entity';
import { CreateEmploiDto } from './dto/create-emploi.dto';
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
      .andWhere('(emploi.salleId = :salleId OR emploi.enseignantId = :enseignantId OR emploi.classeId = :classeId)', {
        salleId, enseignantId, classeId,
      })
      .andWhere('emploi.heureDebut < :heureFin AND emploi.heureFin > :heureDebut', {
        heureDebut, heureFin,
      })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Conflit détecté : salle, enseignant ou classe déjà occupé.');
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
      if (!grouped[jour]) grouped[jour] = [];

      const matiere = await this.adminService.getMatiere(emploi.matiereId);
      const enseignant = await this.adminService.getEnseignant(emploi.enseignantId);
      const salle = await this.adminService.getSalle(emploi.salleId);
      const classe = await this.adminService.getClasse(emploi.classeId);

      grouped[jour].push({
        heureDebut: emploi.heureDebut,
        heureFin: emploi.heureFin,
        matiere: matiere.nom,
        enseignant: `${enseignant.nom} ${enseignant.prenom}`,
        salle: salle.nom,
        classe: classe.nom
      });
    }
    return grouped;
  }
}