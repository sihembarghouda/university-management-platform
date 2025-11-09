import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialite } from './entities/specialite.entity';
import { Departement } from '../departement/entities/departement.entity';
import { SpecialiteService } from './specialite.service';
import { SpecialiteController } from './specialite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Specialite, Departement])],
  controllers: [SpecialiteController],
  providers: [SpecialiteService],
  exports: [TypeOrmModule, SpecialiteService], // <-- export du TypeOrmModule ou du service
})
export class SpecialiteModule {}
