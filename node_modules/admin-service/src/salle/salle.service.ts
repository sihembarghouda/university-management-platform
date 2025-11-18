import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salle } from './entities/salle.entity';
import { CreateSalleDto } from './dto/create-salle.dto';
import { UpdateSalleDto } from './dto/update-salle.dto';
import { Departement } from '../departement/entities/departement.entity';

@Injectable()
export class SalleService {
  constructor(
    @InjectRepository(Salle) private salleRepo: Repository<Salle>,
    @InjectRepository(Departement) private depRepo: Repository<Departement>,
  ) {}

  async create(dto: CreateSalleDto) {
    const dep = await this.depRepo.findOneBy({ id: dto.departementId });
    if (!dep) throw new NotFoundException('Département introuvable');

    const salle = this.salleRepo.create({
      code: dto.code,
      nom: dto.nom,
      type: dto.type,
      capacite: dto.capacite,
      batiment: dto.batiment,
      etage: dto.etage,
      equipements: dto.equipements,
      departement: dep,
    });

    return this.salleRepo.save(salle);
  }

  findAll() {
    return this.salleRepo.find();
  }

  findOne(id: number) {
    return this.salleRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateSalleDto) {
    const salle = await this.salleRepo.findOne({ where: { id } });
    if (!salle) throw new NotFoundException('Salle introuvable');

    if (dto.departementId) {
      const dep = await this.depRepo.findOneBy({ id: dto.departementId });
      if (!dep) throw new NotFoundException('Département introuvable');
      salle.departement = dep;
    }

    Object.assign(salle, dto);
    return this.salleRepo.save(salle);
  }

  remove(id: number) {
    return this.salleRepo.delete(id);
  }
}
