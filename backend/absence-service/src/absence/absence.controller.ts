import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { JustifierAbsenceDto } from './dto/justifier-absence.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MatiereService } from '../matiere/matiere.service';
import { StatutAbsence } from './absence.entity';

@UseGuards(JwtAuthGuard)
@Controller('absences')
export class AbsenceController {
  constructor(
    private readonly absenceService: AbsenceService,
    private readonly matiereService: MatiereService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('enseignant','etudiant','directeur')
  async create(@Req() req, @Body() createDto: CreateAbsenceDto) {
    const user = req.user;
    // Students can submit an "excuse request" (sujet='etudiant').
    if (user.role === 'etudiant') {
      (createDto as any).sujet = 'etudiant';
      // take etudiantId from the JWT to avoid spoofing
      (createDto as any).etudiantId = Number(user.sub);
      (createDto as any).reportedBy = Number(user.sub);
      // mark as pending so teacher/director reviews it
      (createDto as any).statut = StatutAbsence.EN_ATTENTE;
    } else if (user.role === 'enseignant') {
      // If teacher is creating an absence request for themselves
      (createDto as any).sujet = 'enseignant';
      (createDto as any).enseignantId = Number(user.sub);
      (createDto as any).reportedBy = Number(user.sub);
      (createDto as any).statut = StatutAbsence.EN_ATTENTE;
      // teachers should not create student absences via this flow
    } else if (user.role === 'directeur') {
      // director can create either type; accept provided values
    } else {
      throw new ForbiddenException('Accès refusé');
    }

    // Note: Teachers can submit absence requests for any subject

    return this.absenceService.create(createDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('enseignant', 'directeur')
  findAll(@Query('type') type?: string) {
    if (type === 'enseignant') {
      return this.absenceService.findAll({ sujet: 'enseignant' });
    }
    return this.absenceService.findAll();
  }

  @Get('statistiques')
  getStatistiques() {
    return this.absenceService.getStatistiques();
  }

  @Get('etudiants-a-risque')
  @UseGuards(RolesGuard)
  @Roles('enseignant', 'directeur')
  getEtudiantsARisque(@Query('seuil') seuil?: number) {
    return this.absenceService.getEtudiantsARisque(seuil ? Number(seuil) : 25);
  }

  @Get('etudiant/:etudiantId')
  @UseGuards(RolesGuard)
  @Roles('etudiant', 'enseignant', 'directeur')
  getAbsencesByEtudiant(@Req() req, @Param('etudiantId') etudiantId: string) {
    const user = req.user;
    const targetId = Number(etudiantId);
    if (user.role === 'etudiant' && Number(user.sub) !== targetId) {
      throw new ForbiddenException('Accès refusé');
    }
    return this.absenceService.getAbsencesByEtudiant(targetId);
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
  @UseGuards(RolesGuard)
  @Roles('etudiant','enseignant','directeur')
  async findOne(@Req() req, @Param('id') id: string) {
    const absence = await this.absenceService.findOne(Number(id));
    const user = req.user;
    if (user.role === 'etudiant' && Number(user.sub) !== absence.etudiantId) {
      throw new ForbiddenException('Accès refusé');
    }
    return absence;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('enseignant','directeur')
  update(@Param('id') id: string, @Body() updateDto: UpdateAbsenceDto) {
    return this.absenceService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('directeur')
  remove(@Param('id') id: string) {
    return this.absenceService.remove(Number(id));
  }

  @Post(':id/justifier')
  @UseGuards(RolesGuard)
  @Roles('etudiant','enseignant')
  async justifierAbsence(
    @Req() req,
    @Param('id') id: string,
    @Body() justificationDto: JustifierAbsenceDto
  ) {
    const absence = await this.absenceService.findOne(Number(id));
    const user = req.user;
    if (user.role === 'etudiant' && Number(user.sub) !== absence.etudiantId) {
      throw new ForbiddenException('Accès refusé');
    }
    if (user.role === 'enseignant') {
      const ok = await this.matiereService.isTeacherOfMatiere(absence.matiereId, Number(user.sub));
      if (!ok) throw new ForbiddenException('Vous n\'enseignez pas cette matière');
    }
    return this.absenceService.justifierAbsence(Number(id), justificationDto);
  }

  @Post(':id/valider-justification')
  @UseGuards(RolesGuard)
  @Roles('enseignant','directeur')
  async validerJustification(
    @Req() req,
    @Param('id') id: string,
    @Body('accepter') accepter: boolean
  ) {
    console.log(`Validation de justification - ID: ${id}, Accepter: ${accepter}`);
    const user = req.user;
    console.log(`Utilisateur: ${user.sub}, Role: ${user.role}`);
    
    if (user.role === 'enseignant') {
      const absence = await this.absenceService.findOne(Number(id));
      console.log(`Absence trouvée:`, { id: absence.id, matiereId: absence.matiereId, etudiantId: absence.etudiantId });
      
      // Pour l'instant, permettre aux enseignants de valider les justifications de leurs étudiants
      // TODO: Implémenter une vérification plus stricte basée sur les matières enseignées
      // const ok = await this.matiereService.isTeacherOfMatiere(absence.matiereId, Number(user.sub));
      // if (!ok) throw new ForbiddenException('Vous n\'enseignez pas cette matière');
    }
    return this.absenceService.validerJustification(Number(id), accepter);
  }

  @Post(':id/planifier-rattrapage')
  @UseGuards(RolesGuard)
  @Roles('enseignant','directeur')
  async planifierRattrapage(
    @Req() req,
    @Param('id') id: string,
    @Body('dateRattrapage') dateRattrapage: Date,
    @Body('heureRattrapage') heureRattrapage: string
  ) {
    const user = req.user;
    if (user.role === 'enseignant') {
      const absence = await this.absenceService.findOne(Number(id));
      const ok = await this.matiereService.isTeacherOfMatiere(absence.matiereId, Number(user.sub));
      if (!ok) throw new ForbiddenException('Vous n\'enseignez pas cette matière');
    }
    return this.absenceService.planifierRattrapage(Number(id), dateRattrapage, heureRattrapage);
  }

  @Post(':id/rattrapage-effectue')
  @UseGuards(RolesGuard)
  @Roles('enseignant','directeur')
  async marquerRattrapageEffectue(@Req() req, @Param('id') id: string) {
    const user = req.user;
    if (user.role === 'enseignant') {
      const absence = await this.absenceService.findOne(Number(id));
      const ok = await this.matiereService.isTeacherOfMatiere(absence.matiereId, Number(user.sub));
      if (!ok) throw new ForbiddenException('Vous n\'enseignez pas cette matière');
    }
    return this.absenceService.marquerRattrapageEffectue(Number(id));
  }

  @Post(':id/envoyer-alerte')
  @UseGuards(RolesGuard)
  @Roles('directeur')
  envoyerAlerteElimination(@Param('id') id: string) {
    return this.absenceService.envoyerAlerteElimination(Number(id));
  }
}
