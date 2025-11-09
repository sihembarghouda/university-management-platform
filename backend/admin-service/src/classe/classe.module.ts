import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classe } from './entities/classe.entity';
import { Niveau } from '../niveau/entities/niveau.entity';
import { ClasseService } from './classe.service';
import { ClasseController } from './classe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Classe, Niveau])],
  controllers: [ClasseController],
  providers: [ClasseService],
})
export class ClasseModule {}
