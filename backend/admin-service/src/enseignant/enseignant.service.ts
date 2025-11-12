// src/enseignant/enseignant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { SpecialiteEnseignement } from './specialite-enseignement.entity';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';

@Injectable()
export class EnseignantService {
  constructor(
    @InjectRepository(Enseignant)
    private enseignantRepo: Repository<Enseignant>,
    @InjectRepository(Departement)
    private depRepo: Repository<Departement>,
    @InjectRepository(SpecialiteEnseignement)
    private specEnsRepo: Repository<SpecialiteEnseignement>,
  ) {}

  async create(dto: CreateEnseignantDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    if (!departement) throw new NotFoundException('Département introuvable');

    const specialiteEnseignement = await this.specEnsRepo.findOneBy({ 
      id: dto.specialiteEnseignementId 
    });
    if (!specialiteEnseignement) throw new NotFoundException('Spécialité d\'enseignement introuvable');

    const enseignant = this.enseignantRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      grade: dto.grade,
      departement,
      specialiteEnseignement,
    });

    return this.enseignantRepo.save(enseignant);
  }

  findAll() {
    return this.enseignantRepo.find({
      relations: ['departement', 'specialiteEnseignement'],
    });
  }

  async findOne(id: number) {
    const enseignant = await this.enseignantRepo.findOne({
      where: { id },
      relations: ['departement', 'specialiteEnseignement'],
    });
    if (!enseignant) throw new NotFoundException('Enseignant non trouvé');
    return enseignant;
  }

  async update(id: number, dto: CreateEnseignantDto) {
    const enseignant = await this.findOne(id);

    if (dto.departementId) {
      const departement = await this.depRepo.findOneBy({ id: dto.departementId });
      if (!departement) throw new NotFoundException('Département introuvable');
      enseignant.departement = departement;
    }

    if (dto.specialiteEnseignementId) {
      const specialiteEnseignement = await this.specEnsRepo.findOneBy({ 
        id: dto.specialiteEnseignementId 
      });
      if (!specialiteEnseignement) throw new NotFoundException('Spécialité d\'enseignement introuvable');
      enseignant.specialiteEnseignement = specialiteEnseignement;
    }

    enseignant.nom = dto.nom;
    enseignant.prenom = dto.prenom;
    enseignant.email = dto.email;
    enseignant.grade = dto.grade;

    return this.enseignantRepo.save(enseignant);
  }

  async remove(id: number) {
    const enseignant = await this.findOne(id);
    await this.enseignantRepo.remove(enseignant);
    return { message: 'Enseignant supprimé avec succès' };
  }
}
