import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploiDuTemps } from './entities/emploi-du-temps.entity';
import { EmploiDuTempsService } from './emploi-du-temps.service';
import { EmploiDuTempsController } from './emploi-du-temps.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmploiDuTemps]),
    AdminModule,
  ],
  controllers: [EmploiDuTempsController],
  providers: [EmploiDuTempsService],
})
export class EmploiDuTempsModule {}