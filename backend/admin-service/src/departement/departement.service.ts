import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departement } from './entities/departement.entity';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';

@Injectable()
export class DepartementService {
  constructor(
    @InjectRepository(Departement)
    private repo: Repository<Departement>,
  ) {}

  create(dto: CreateDepartementDto) {
    const dep = this.repo.create({ nom: dto.nom });
    return this.repo.save(dep);
  }

  findAll() {
    return this.repo.find({ relations: ['specialites'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['specialites'] });
  }

  async update(id: number, dto: UpdateDepartementDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
