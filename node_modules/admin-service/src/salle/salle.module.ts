import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salle } from './entities/salle.entity';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';
import { Departement } from '../departement/entities/departement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salle, Departement])],
  controllers: [SalleController],
  providers: [SalleService],
  exports: [SalleService],
})
export class SalleModule {}
