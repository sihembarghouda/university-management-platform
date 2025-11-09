import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialite } from './entities/specialite.entity';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { Departement } from '../departement/entities/departement.entity';

@Injectable()
export class SpecialiteService {
  constructor(
    @InjectRepository(Specialite)
    private repo: Repository<Specialite>,
    @InjectRepository(Departement)
    private depRepo: Repository<Departement>,
  ) {}

  async create(dto: CreateSpecialiteDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    const specialite = this.repo.create({ nom: dto.nom, departement });
    return this.repo.save(specialite);
  }

  findAll() {
    return this.repo.find({ relations: ['departement', 'niveaux'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['departement', 'niveaux'],
    });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
