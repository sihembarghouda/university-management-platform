import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClasseModule } from './classe/classe.module';
import { NiveauModule } from './niveau/niveau.module';
import { SpecialiteModule } from './specialite/specialite.module';
import { DepartementModule } from './departement/departement.module';
import { EnseignantModule } from './enseignant/enseignant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'university_db',
      autoLoadEntities: true,
      synchronize: true, // <--- très important pour créer les tables automatiquement
    }),

    DepartementModule,
    EnseignantModule,
    SpecialiteModule,
    NiveauModule,
    ClasseModule,
  ],
})
export class AppModule {}
