import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { JustifierAbsenceDto } from './dto/justifier-absence.dto';

@Controller('absences')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  // CRUD de base
  @Post()
  create(@Body() createDto: CreateAbsenceDto) {
    return this.absenceService.create(createDto);
  }

  @Get()
  findAll() {
    return this.absenceService.findAll();
  }

  @Get('statistiques')
  getStatistiques() {
    return this.absenceService.getStatistiques();
  }

  @Get('etudiants-a-risque')
  getEtudiantsARisque(@Query('seuil') seuil?: number) {
    return this.absenceService.getEtudiantsARisque(seuil ? Number(seuil) : 25);
  }

  @Get('etudiant/:etudiantId')
  getAbsencesByEtudiant(@Param('etudiantId') etudiantId: string) {
    return this.absenceService.getAbsencesByEtudiant(Number(etudiantId));
  }

  @Get('matiere/:matiereId')
  getAbsencesByMatiere(@Param('matiereId') matiereId: string) {
    return this.absenceService.getAbsencesByMatiere(Number(matiereId));
  }

  @Get('etudiant/:etudiantId/total-heures')
  getTotalHeuresAbsence(
    @Param('etudiantId') etudiantId: string,
    @Query('matiereId') matiereId?: string
  ) {
    return this.absenceService.getTotalHeuresAbsence(
      Number(etudiantId),
      matiereId ? Number(matiereId) : undefined
    );
  }

  @Get('etudiant/:etudiantId/risque-elimination')
  verifierRisqueElimination(
    @Param('etudiantId') etudiantId: string,
    @Query('matiereId') matiereId: string,
    @Query('totalHeuresMatiere') totalHeuresMatiere?: string
  ) {
    return this.absenceService.verifierRisqueElimination(
      Number(etudiantId),
      Number(matiereId),
      totalHeuresMatiere ? Number(totalHeuresMatiere) : 40
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAbsenceDto) {
    return this.absenceService.update(Number(id), updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(Number(id));
  }

  // Fonctionnalités spécifiques
  
  @Post(':id/justifier')
  justifierAbsence(
    @Param('id') id: string,
    @Body() justificationDto: JustifierAbsenceDto
  ) {
    return this.absenceService.justifierAbsence(Number(id), justificationDto);
  }

  @Post(':id/valider-justification')
  validerJustification(
    @Param('id') id: string,
    @Body('accepter') accepter: boolean
  ) {
    return this.absenceService.validerJustification(Number(id), accepter);
  }

  @Post(':id/planifier-rattrapage')
  planifierRattrapage(
    @Param('id') id: string,
    @Body('dateRattrapage') dateRattrapage: Date,
    @Body('heureRattrapage') heureRattrapage: string
  ) {
    return this.absenceService.planifierRattrapage(Number(id), dateRattrapage, heureRattrapage);
  }

  @Post(':id/rattrapage-effectue')
  marquerRattrapageEffectue(@Param('id') id: string) {
    return this.absenceService.marquerRattrapageEffectue(Number(id));
  }

  @Post(':id/envoyer-alerte')
  envoyerAlerteElimination(@Param('id') id: string) {
    return this.absenceService.envoyerAlerteElimination(Number(id));
  }
}
