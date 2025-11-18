import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnseignantService } from './enseignant.service';
import { EnseignantController } from './enseignant.controller';
import { SpecialiteEnseignementController } from './specialite-enseignement.controller';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { SpecialiteEnseignement } from './specialite-enseignement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enseignant, Departement, SpecialiteEnseignement]),
  ],
  controllers: [EnseignantController, SpecialiteEnseignementController],
  providers: [EnseignantService],
  exports: [EnseignantService],
})
export class EnseignantModule {}
