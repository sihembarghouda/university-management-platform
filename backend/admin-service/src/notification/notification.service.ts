import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    console.log('🔔 Création de notification:', createNotificationDto);
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async findByEtudiant(etudiantId: number): Promise<Notification[]> {
    console.log('📬 Récupération notifications pour étudiant:', etudiantId);
    return await this.notificationRepository.find({
      where: { etudiantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByEnseignant(enseignantId: number): Promise<Notification[]> {
    console.log('📬 Récupération notifications pour enseignant:', enseignantId);
    return await this.notificationRepository.find({
      where: { enseignantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByEtudiant(etudiantId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { etudiantId, lu: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByEnseignant(enseignantId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { enseignantId, lu: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(etudiantId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { etudiantId, lu: false },
    });
  }

  async getUnreadCountEnseignant(enseignantId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { enseignantId, lu: false },
    });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (notification) {
      notification.lu = true;
      return await this.notificationRepository.save(notification);
    }
    return null;
  }

  async markAllAsRead(etudiantId: number): Promise<void> {
    await this.notificationRepository.update(
      { etudiantId, lu: false },
      { lu: true },
    );
  }

  async markAllAsReadEnseignant(enseignantId: number): Promise<void> {
    await this.notificationRepository.update(
      { enseignantId, lu: false },
      { lu: true },
    );
  }

  async findByDirecteur(directeurId: number): Promise<Notification[]> {
    console.log('📬 Récupération notifications pour directeur:', directeurId);
    return await this.notificationRepository.find({
      where: { directeurId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByDirecteur(directeurId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { directeurId, lu: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCountDirecteur(directeurId: number): Promise<number> {
    const count = await this.notificationRepository.count({
      where: { directeurId, lu: false },
    });
    return count;
  }

  async markAllAsReadDirecteur(directeurId: number): Promise<void> {
    await this.notificationRepository.update(
      { directeurId, lu: false },
      { lu: true },
    );
  }

  async createAbsenceNotificationToDirecteur(
    enseignantId: number,
    directeurId: number,
    enseignantNom: string,
    matiereNom: string,
    date: string,
    motif: string
  ): Promise<Notification> {
    const createNotificationDto: CreateNotificationDto = {
      type: 'absence_enseignant',
      titre: `Absence d'enseignant - ${matiereNom}`,
      message: `${enseignantNom} sera absent(e) le ${date} pour le cours de ${matiereNom}. Motif: ${motif}`,
      directeurId,
      enseignantNom,
      matiereNom,
      date,
    };

    console.log('🔔 Création notification d\'absence enseignant vers directeur:', createNotificationDto);
    return await this.create(createNotificationDto);
  }

  async delete(id: number): Promise<void> {
    console.log('🗑️ Suppression notification:', id);
    await this.notificationRepository.delete(id);
  }
}
