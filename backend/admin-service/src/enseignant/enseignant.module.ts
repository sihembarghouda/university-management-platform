// src/enseignant/enseignant.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { EnseignantService } from './enseignant.service';
import { EnseignantController } from './enseignant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enseignant, Departement])],
  controllers: [EnseignantController],
  providers: [EnseignantService],
})
export class EnseignantModule {}
