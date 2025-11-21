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
      // Créer chaque emploi du temps individuellement
      const promises = scheduleData.courses.map(course => 
        this.createEmploi({
          classeId: scheduleData.classId,
          enseignantId: course.teacherId,
          salleId: course.roomId,
          matiereId: course.subjectId,
          date: course.date,
          heureDebut: course.heureDebut,
          heureFin: course.heureFin,
          semestre: scheduleData.semestre || 1
        })
      );
      
      const results = await Promise.all(promises);
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
  }
};

export default scheduleService;