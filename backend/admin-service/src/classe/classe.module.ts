import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClasseService } from './classe.service';
import { ClasseController } from './classe.controller';
import { Classe } from './entities/classe.entity';
import { Niveau } from './entities/niveau.entity';
import { Specialite } from './entities/specialite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classe, Niveau, Specialite])],
  controllers: [ClasseController],
  providers: [ClasseService],
  exports: [ClasseService],
})
export class ClasseModule {}
