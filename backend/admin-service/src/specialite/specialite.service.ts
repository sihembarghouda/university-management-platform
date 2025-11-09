import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialite } from './entities/specialite.entity';
import { Departement } from '../departement/entities/departement.entity';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/update-specialite.dto';

@Injectable()
export class SpecialiteService {
  constructor(
    @InjectRepository(Specialite)
    private readonly specialiteRepo: Repository<Specialite>,

    @InjectRepository(Departement)
    private readonly departementRepo: Repository<Departement>,
  ) {}

  async create(dto: CreateSpecialiteDto) {
    const departement = await this.departementRepo.findOne({
      where: { id: dto.departementId },
    });

    if (!departement) {
      throw new NotFoundException('Département non trouvé');
    }

    const specialite = this.specialiteRepo.create({
      nom: dto.nom,
      departement, // ⚠️ on ne met pas null ici
    });

    return this.specialiteRepo.save(specialite);
  }

  findAll() {
    return this.specialiteRepo.find({ relations: ['departement'] });
  }

  findOne(id: number) {
    return this.specialiteRepo.findOne({
      where: { id },
      relations: ['departement'],
    });
  }

  async update(id: number, dto: UpdateSpecialiteDto) {
    const specialite = await this.specialiteRepo.findOne({ where: { id } });
    if (!specialite) {
      throw new NotFoundException('Spécialité non trouvée');
    }

    if (dto.departementId) {
      const departement = await this.departementRepo.findOne({
        where: { id: dto.departementId },
      });
      if (!departement) {
        throw new NotFoundException('Département non trouvé');
      }
      specialite.departement = departement;
    }

    if (dto.nom) {
      specialite.nom = dto.nom;
    }

    return this.specialiteRepo.save(specialite);
  }

  remove(id: number) {
    return this.specialiteRepo.delete(id);
  }
}
