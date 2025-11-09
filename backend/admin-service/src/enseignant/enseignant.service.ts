// src/enseignant/enseignant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Classe } from '../classe/entities/classe.entity';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';

@Injectable()
export class EnseignantService {
  constructor(
    @InjectRepository(Enseignant)
    private enseignantRepo: Repository<Enseignant>,
    @InjectRepository(Departement)
    private depRepo: Repository<Departement>,
    @InjectRepository(Specialite)
    private specRepo: Repository<Specialite>,
    @InjectRepository(Classe)
    private classeRepo: Repository<Classe>,
  ) {}

  async create(dto: CreateEnseignantDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    if (!departement) throw new NotFoundException('Département introuvable');

    const specialites = await this.specRepo.find({
      where: { id: In(dto.specialiteIds) },
    });

    const classes = await this.classeRepo.find({
      where: { id: In(dto.classeIds) },
    });

    const enseignant = this.enseignantRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      grade: dto.grade,
      departement,
      specialites,
      classes,
    });

    return this.enseignantRepo.save(enseignant);
  }

  findAll() {
    return this.enseignantRepo.find({
      relations: ['departement', 'specialites', 'classes'],
    });
  }

  findOne(id: number) {
    return this.enseignantRepo.findOne({
      where: { id },
      relations: ['departement', 'specialites', 'classes'],
    });
  }

  remove(id: number) {
    return this.enseignantRepo.delete(id);
  }
}
