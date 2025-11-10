import { adminApi } from "../config/api";

// ==================== DÉPARTEMENTS ====================
export const departementService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/departement");
      return response.data;
    } catch (error) {
      console.error("Erreur departementService.getAll:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/departement/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur departementService.getById:", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/departement", data);
      return response.data;
    } catch (error) {
      console.error("Erreur departementService.create:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await adminApi.patch(`/departement/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur departementService.update:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/departement/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Erreur departementService.delete:", error);
      throw error;
    }
  }
};

// ==================== CLASSES ====================
export const classeService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/classe");
      return response.data;
    } catch (error) {
      console.error('Erreur classeService.getAll:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/classe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur classeService.getById:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/classe", data);
      return response.data;
    } catch (error) {
      console.error('Erreur classeService.create:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await adminApi.patch(`/classe/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur classeService.update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/classe/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur classeService.delete:', error);
      throw error;
    }
  }
};

// ==================== ENSEIGNANTS ====================
export const enseignantService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/enseignant");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur de récupération" };
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/enseignant/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Enseignant non trouvé" };
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/enseignant", data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur de création" };
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/enseignant/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur de suppression" };
    }
  }
};

// ==================== ÉTUDIANTS ====================
export const etudiantService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/etudiants");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur de récupération" };
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/etudiants", data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Erreur de création" };
    }
  }
};

// ==================== SPÉCIALITÉS ====================
export const specialiteService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/specialite");
      return response.data;
    } catch (error) {
      console.error("Erreur specialiteService.getAll:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/specialite/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur specialiteService.getById:", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/specialite", data);
      return response.data;
    } catch (error) {
      console.error("Erreur specialiteService.create:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await adminApi.patch(`/specialite/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur specialiteService.update:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/specialite/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Erreur specialiteService.delete:", error);
      throw error;
    }
  }
};

// ==================== NIVEAUX ====================
export const niveauService = {
  getAll: async () => {
    try {
      const response = await adminApi.get("/niveau");
      return response.data;
    } catch (error) {
      console.error("Erreur niveauService.getAll:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await adminApi.get(`/niveau/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur niveauService.getById:", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await adminApi.post("/niveau", data);
      return response.data;
    } catch (error) {
      console.error("Erreur niveauService.create:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await adminApi.patch(`/niveau/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur niveauService.update:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await adminApi.delete(`/niveau/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Erreur niveauService.delete:", error);
      throw error;
    }
  }
};

// ==================== STATISTIQUES ====================
export const statsService = {
  // Stats pour le dashboard directeur
  getDirectorStats: async () => {
    try {
      // En attendant l'endpoint stats, on récupère les données de base
      const [depts, enseignants, etudiants, classes] = await Promise.all([
        departementService.getAll(),
        enseignantService.getAll(),
        etudiantService.getAll(),
        classeService.getAll()
      ]);

      return {
        success: true,
        data: {
          totalDepartements: depts.data?.length || 0,
          totalEnseignants: enseignants.data?.length || 0,
          totalEtudiants: etudiants.data?.length || 0,
          totalClasses: classes.data?.length || 0
        }
      };
    } catch (error) {
      return { success: false, message: "Erreur lors du chargement des statistiques" };
    }
  }
};
