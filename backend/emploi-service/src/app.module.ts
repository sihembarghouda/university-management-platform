import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploiDuTempsModule } from './emploi-du-temps/emploi-du-temps.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'university_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminModule,
    EmploiDuTempsModule,
  ],
})
export class AppModule {}