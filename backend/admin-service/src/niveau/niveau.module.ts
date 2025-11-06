import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Niveau } from './entities/niveau.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { NiveauService } from './niveau.service';
import { NiveauController } from './niveau.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Niveau, Specialite])],
  controllers: [NiveauController],
  providers: [NiveauService],
  exports: [NiveauService],
})
export class NiveauModule {}
