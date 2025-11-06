// src/enseignant/enseignant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enseignant } from './enseignant.entity';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { Departement } from '../departement/entities/departement.entity';
@Injectable()
export class EnseignantService {
  constructor(
    @InjectRepository(Enseignant)
    private enseignantRepo: Repository<Enseignant>,
    @InjectRepository(Departement)
    private departementRepo: Repository<Departement>,
  ) {}

  async create(dto: CreateEnseignantDto) {
    const departement = await this.departementRepo.findOneBy({
      id: dto.departementId,
    });

    if (!departement) throw new Error('Département introuvable');

    const enseignant = this.enseignantRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      departement,
    });

    return this.enseignantRepo.save(enseignant);
  }

  findAll() {
    return this.enseignantRepo.find({ relations: ['departement'] });
  }

  findOne(id: number) {
    return this.enseignantRepo.findOne({
      where: { id },
      relations: ['departement'],
    });
  }

  async remove(id: number) {
    return this.enseignantRepo.delete(id);
  }
}
