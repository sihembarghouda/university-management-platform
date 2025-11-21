import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  private readonly adminServiceUrl = process.env.ADMIN_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  // Récupérer un enseignant par ID
  async getEnseignant(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/enseignants/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Enseignant avec ID ${id} introuvable`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Récupérer tous les enseignants
  async getEnseignants() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/enseignants`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des enseignants',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Récupérer une matière par ID
  async getMatiere(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/matieres/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Matière avec ID ${id} introuvable`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Récupérer toutes les matières
  async getMatieres() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/matieres`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des matières',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Récupérer une salle par ID
  async getSalle(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/salles/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Salle avec ID ${id} introuvable`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Récupérer toutes les salles
  async getSalles() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/salles`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des salles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Récupérer une classe par ID
  async getClasse(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/classes/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Classe avec ID ${id} introuvable`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  // Récupérer toutes les classes
  async getClasses() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adminServiceUrl}/classes`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des classes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Vérifier la disponibilité d'une salle
  async checkSalleDisponibilite(salleId: number, date: string, heureDebut: string, heureFin: string) {
    try {
      const salle = await this.getSalle(salleId);
      // Vous pouvez ajouter une logique supplémentaire ici
      return { disponible: true, salle };
    } catch (error) {
      throw error;
    }
  }

  // Vérifier la disponibilité d'un enseignant
  async checkEnseignantDisponibilite(enseignantId: number, date: string, heureDebut: string, heureFin: string) {
    try {
      const enseignant = await this.getEnseignant(enseignantId);
      // Vous pouvez ajouter une logique supplémentaire ici
      return { disponible: true, enseignant };
    } catch (error) {
      throw error;
    }
  }
}
