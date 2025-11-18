import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialiteEnseignement } from './specialite-enseignement.entity';

@Controller('specialite-enseignement')
export class SpecialiteEnseignementController {
  constructor(
    @InjectRepository(SpecialiteEnseignement)
    private readonly specialiteEnseignementRepo: Repository<SpecialiteEnseignement>,
  ) {}

  @Get()
  async findAll() {
    return this.specialiteEnseignementRepo.find({
      order: { domaine: 'ASC', nom: 'ASC' },
    });
  }
}
