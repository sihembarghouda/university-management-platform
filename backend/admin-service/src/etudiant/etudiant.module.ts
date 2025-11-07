import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './entities/etudiant.entity';
import { Classe } from '../classe/entities/classe.entity';
import { EtudiantService } from './etudiant.service';
import { EtudiantController } from './etudiant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Etudiant, Classe])],
  controllers: [EtudiantController],
  providers: [EtudiantService],
})
export class EtudiantModule {}
