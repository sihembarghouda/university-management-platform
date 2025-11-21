import axios from "axios";

// Configuration des URLs de base pour chaque service
export const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || "http://localhost:3001/api";
export const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || "http://localhost:3002";

// Instance axios pour le service d'authentification
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

// Instance axios pour le service admin
export const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
});

// Intercepteur pour ajouter le token à toutes les requêtes
const addAuthToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Appliquer l'intercepteur aux deux instances
authApi.interceptors.request.use(addAuthToken);
adminApi.interceptors.request.use(addAuthToken);

// Intercepteur pour gérer les erreurs d'authentification
const handleAuthError = (error) => {
  // Log l'erreur pour déboguer
  console.error('API Error:', error.response?.status, error.response?.data);
  
  // Ne pas rediriger vers login pour les erreurs admin API (pour le développement)
  if (error.response?.status === 401 && error.config.baseURL === AUTH_API_URL) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use((response) => response, handleAuthError);
adminApi.interceptors.response.use((response) => response, handleAuthError);

export default { authApi, adminApi };
