import axios from 'axios';
import { adminApi } from '../config/api';

const EMPLOI_API_URL = process.env.REACT_APP_EMPLOI_API_URL || 'http://localhost:3010';

// Configuration axios pour le service emploi du temps
const emploiAPI = axios.create({
  baseURL: EMPLOI_API_URL,
  timeout: 10000,
});

// Intercepteur pour ajouter le token d'authentification
emploiAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses d'erreur
emploiAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const scheduleService = {
  // Récupérer toutes les classes depuis admin-service
  async getClasses() {
    try {
      const response = await adminApi.get('/classe');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      throw error;
    }
  },

  // Récupérer tous les enseignants depuis admin-service
  async getTeachers() {
    try {
      const response = await adminApi.get('/enseignant');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
      throw error;
    }
  },

  // Récupérer toutes les matières depuis admin-service
  async getSubjects() {
    try {
      const response = await adminApi.get('/matiere');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
      throw error;
    }
  },

  // Récupérer toutes les salles depuis admin-service
  async getRooms() {
    try {
      const response = await adminApi.get('/salles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
      throw error;
    }
  },

  // Créer un emploi du temps (un seul créneau)
  async createEmploi(emploiData) {
    try {
      const response = await emploiAPI.post('/emplois-du-temps', emploiData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'emploi:', error);
      throw error;
    }
  },

  // Sauvegarder plusieurs emplois du temps (plusieurs créneaux)
  async saveSchedule(scheduleData) {
    try {
      // Créer chaque emploi du temps séquentiellement pour détecter les conflits
      const results = [];
      for (const course of scheduleData.courses) {
        const result = await this.createEmploi({
          classeId: scheduleData.classId,
          enseignantId: course.teacherId,
          salleId: course.roomId,
          matiereId: course.subjectId,
          date: course.date,
          heureDebut: course.heureDebut,
          heureFin: course.heureFin,
          semestre: scheduleData.semestre || 1
        });
        results.push(result);
      }
      
      return { success: true, data: results };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  },

  // Récupérer l'emploi du temps d'une classe
  async getScheduleByClass(classId, semestre = 1) {
    try {
      const response = await emploiAPI.get(`/emplois-du-temps/classe/${classId}/schedule/${semestre}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer l'emploi du temps d'un enseignant
  async getScheduleByTeacher(enseignantId, semestre = 1) {
    try {
      const response = await emploiAPI.get(`/emplois-du-temps/enseignant/${enseignantId}/schedule/${semestre}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer l'emploi du temps d'un étudiant (basé sur sa classe)
  async getScheduleByStudent(etudiantId, semestre = 1) {
    try {
      const response = await emploiAPI.get(`/emplois-du-temps/etudiant/${etudiantId}/schedule/${semestre}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer MON emploi du temps (étudiant ou enseignant)
  async getMySchedule(user, semestre = 1) {
    try {
      if (user.role === 'etudiant') {
        return await this.getScheduleByStudent(user.id, semestre);
      } else if (user.role === 'enseignant' || user.role === 'directeur_departement') {
        return await this.getScheduleByTeacher(user.id, semestre);
      } else {
        throw new Error('Type d\'utilisateur non supporté pour l\'emploi du temps personnel');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de mon emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer l'emploi du temps d'une salle
  async getScheduleBySalle(salleId, semestre = 1) {
    try {
      const response = await emploiAPI.get(`/emplois-du-temps/salle/${salleId}/schedule/${semestre}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer tous les emplois du temps
  async getAllSchedules() {
    try {
      const response = await emploiAPI.get('/emplois-du-temps');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des emplois du temps:', error);
      throw error;
    }
  },

  // Modifier un emploi du temps
  async updateEmploi(emploiId, emploiData) {
    try {
      const response = await emploiAPI.patch(`/emplois-du-temps/${emploiId}`, emploiData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'emploi:', error);
      throw error;
    }
  },

  // Supprimer un emploi du temps
  async deleteEmploi(emploiId) {
    try {
      const response = await emploiAPI.delete(`/emplois-du-temps/${emploiId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'emploi:', error);
      throw error;
    }
  }
};

export default scheduleService;