import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmploiDuTempsService } from './emploi-du-temps.service';
import { CreateEmploiDto } from './dto/create-emploi.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { EmploiDuTemps } from './entities/emploi-du-temps.entity';

@ApiTags('Emplois du Temps')
@Controller('emplois-du-temps')
export class EmploiDuTempsController {
  constructor(private readonly service: EmploiDuTempsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Emploi du temps créé', type: EmploiDuTemps })
  create(@Body() dto: CreateEmploiDto) {
    return this.service.create(dto);
  }

  @Get('classe/:id/schedule/:semestre')
  @ApiResponse({ status: 200, description: 'Planning complet pour une classe par semestre' })
  getScheduleForClass(@Param('id') id: number, @Param('semestre') semestre: number) {
    return this.service.getScheduleForClass(id, semestre);
  }

  @Get('enseignant/:id/schedule/:semestre')
  @ApiResponse({ status: 200, description: 'Planning complet pour un enseignant par semestre' })
  getScheduleForEnseignant(@Param('id') id: number, @Param('semestre') semestre: number) {
    return this.service.getScheduleForEnseignant(id, semestre);
  }

  @Get('salle/:id/schedule/:semestre')
  @ApiResponse({ status: 200, description: 'Planning complet pour une salle par semestre' })
  getScheduleForSalle(@Param('id') id: number, @Param('semestre') semestre: number) {
    return this.service.getScheduleForSalle(id, semestre);
  }

  @Get('today/enseignant/:id')
  @ApiResponse({ status: 200, description: "Séances d'aujourd'hui pour un enseignant" })
  getTodayForEnseignant(@Param('id') id: number) {
    return this.service.getTodayForEnseignant(Number(id));
  }

  @Get('today/etudiant/:id')
  @ApiResponse({ status: 200, description: "Séances d'aujourd'hui pour un étudiant (par sa classe)" })
  getTodayForEtudiant(@Param('id') id: number) {
    return this.service.getTodayForEtudiant(Number(id));
  }

  @Get('session/:id')
  @ApiResponse({ status: 200, description: 'Détails d une séance (avec liste des étudiants)' })
  getSessionDetails(@Param('id') id: number) {
    return this.service.getSessionDetails(Number(id));
  }
}