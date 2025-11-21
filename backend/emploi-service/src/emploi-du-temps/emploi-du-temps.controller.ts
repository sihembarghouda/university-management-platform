import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { EmploiDuTempsService } from './emploi-du-temps.service';
import { CreateEmploiDto } from './dto/create-emploi.dto';
import { UpdateEmploiDto } from './dto/update-emploi.dto';
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

  @Get('etudiant/:id/schedule/:semestre')
  @ApiResponse({ status: 200, description: 'Planning complet pour un étudiant par semestre (basé sur sa classe)' })
  async getScheduleForEtudiant(@Param('id') id: number, @Param('semestre') semestre: number) {
    return this.service.getScheduleForEtudiant(id, semestre);
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

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Emploi du temps modifié', type: EmploiDuTemps })
  update(@Param('id') id: number, @Body() dto: UpdateEmploiDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Emploi du temps supprimé' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}