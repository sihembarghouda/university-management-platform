import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { Absence } from './absence.entity';
import { Matiere } from '../matiere/entities/matiere.entity';
import { Enseignant } from '../matiere/entities/enseignant.entity';
import { MatiereService } from '../matiere/matiere.service';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    TypeOrmModule.forFeature([Absence, Matiere, Enseignant])
  ],
  controllers: [AbsenceController],
  providers: [AbsenceService, MatiereService],
  exports: [AbsenceService],
})
export class AbsenceModule {}
