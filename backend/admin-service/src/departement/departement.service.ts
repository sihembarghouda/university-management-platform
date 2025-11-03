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
    private departementRepository: Repository<Departement>,
  ) {}

  create(dto: CreateDepartementDto) {
    const dep = this.departementRepository.create(dto);
    return this.departementRepository.save(dep);
  }

  findAll() {
    return this.departementRepository.find();
  }

  findOne(id: number) {
    return this.departementRepository.findOneBy({ id });
  }

  update(id: number, dto: UpdateDepartementDto) {
    return this.departementRepository.update(id, dto);
  }

  remove(id: number) {
    return this.departementRepository.delete(id);
  }
}
