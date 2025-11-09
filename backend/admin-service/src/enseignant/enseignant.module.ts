import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnseignantService } from './enseignant.service';
import { EnseignantController } from './enseignant.controller';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { Classe } from '../classe/entities/classe.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Enseignant, Departement, Specialite, Classe]),
  ],
  controllers: [EnseignantController],
  providers: [EnseignantService],
  exports: [EnseignantService],
})
export class EnseignantModule {}
