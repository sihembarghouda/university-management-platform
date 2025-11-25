import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    console.log('🔔 API: Création notification reçue:', createNotificationDto);
    return await this.notificationService.create(createNotificationDto);
  }

  @Get('etudiant/:etudiantId')
  async findByEtudiant(@Param('etudiantId') etudiantId: string) {
    console.log('📬 API: Récupération notifications pour étudiant:', etudiantId);
    return await this.notificationService.findByEtudiant(+etudiantId);
  }

  @Get('etudiant/:etudiantId/unread')
  async findUnreadByEtudiant(@Param('etudiantId') etudiantId: string) {
    return await this.notificationService.findUnreadByEtudiant(+etudiantId);
  }

  @Get('etudiant/:etudiantId/count')
  async getUnreadCount(@Param('etudiantId') etudiantId: string) {
    const count = await this.notificationService.getUnreadCount(+etudiantId);
    return { count };
  }

  @Get('enseignant/:enseignantId')
  async findByEnseignant(@Param('enseignantId') enseignantId: string) {
    console.log('📬 API: Récupération notifications pour enseignant:', enseignantId);
    return await this.notificationService.findByEnseignant(+enseignantId);
  }

  @Get('enseignant/:enseignantId/unread')
  async findUnreadByEnseignant(@Param('enseignantId') enseignantId: string) {
    return await this.notificationService.findUnreadByEnseignant(+enseignantId);
  }

  @Get('enseignant/:enseignantId/count')
  async getUnreadCountEnseignant(@Param('enseignantId') enseignantId: string) {
    const count = await this.notificationService.getUnreadCountEnseignant(+enseignantId);
    return { count };
  }

  @Patch('enseignant/:enseignantId/read-all')
  async markAllAsReadEnseignant(@Param('enseignantId') enseignantId: string) {
    await this.notificationService.markAllAsReadEnseignant(+enseignantId);
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(+id);
  }

  @Patch('etudiant/:etudiantId/read-all')
  async markAllAsRead(@Param('etudiantId') etudiantId: string) {
    await this.notificationService.markAllAsRead(+etudiantId);
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  @Get('directeur/:directeurId')
  async findByDirecteur(@Param('directeurId') directeurId: string) {
    console.log('📬 API: Récupération notifications pour directeur:', directeurId);
    return await this.notificationService.findByDirecteur(+directeurId);
  }

  @Get('directeur/:directeurId/unread')
  async findUnreadByDirecteur(@Param('directeurId') directeurId: string) {
    return await this.notificationService.findUnreadByDirecteur(+directeurId);
  }

  @Get('directeur/:directeurId/count')
  async getUnreadCountDirecteur(@Param('directeurId') directeurId: string) {
    const count = await this.notificationService.getUnreadCountDirecteur(+directeurId);
    return { count };
  }

  @Patch('directeur/:directeurId/read-all')
  async markAllAsReadDirecteur(@Param('directeurId') directeurId: string) {
    await this.notificationService.markAllAsReadDirecteur(+directeurId);
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  @Post('absence-enseignant')
  async createAbsenceNotificationToDirecteur(@Body() body: {
    enseignantId: number;
    directeurId: number;
    enseignantNom: string;
    matiereNom: string;
    date: string;
    motif: string;
  }) {
    console.log('🔔 API: Création notification d\'absence enseignant:', body);
    return await this.notificationService.createAbsenceNotificationToDirecteur(
      body.enseignantId,
      body.directeurId,
      body.enseignantNom,
      body.matiereNom,
      body.date,
      body.motif
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('🗑️ API: Suppression notification:', id);
    return await this.notificationService.delete(+id);
  }
}
