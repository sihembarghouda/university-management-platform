import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matiere } from './entities/matiere.entity';
import { MatiereService } from './matiere.service';
import { MatiereController } from './matiere.controller';
import { Departement } from '../departement/entities/departement.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Niveau } from '../niveau/entities/niveau.entity';
import { Enseignant } from '../enseignant/enseignant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Matiere,
      Departement,
      Specialite,
      Niveau,
      Enseignant,
    ]),
  ],
  controllers: [MatiereController],
  providers: [MatiereService],
})
export class MatiereModule {}
