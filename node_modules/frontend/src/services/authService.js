import axios from 'axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:3000/api';

/**
 * Service pour gérer l'authentification avec notre backend
 */
const authService = {
  /**
   * Demander un lien de réinitialisation de mot de passe
   * @param {string} email - L'email de l'utilisateur
   */
  async requestPasswordReset(email) {
    try {
      console.log('🔐 [Password Reset] Demande de réinitialisation pour:', email);
      
      const response = await axios.post(`${AUTH_API_URL}/auth/forgot-password`, { email });
      
      console.log('✅ [Password Reset] Email envoyé avec succès!');
      
      return {
        success: true,
        message: response.data.message || 'Un email de réinitialisation a été envoyé'
      };
    } catch (error) {
      console.error('❌ [Password Reset] Erreur:', error);
      throw error;
    }
  },

  /**
   * Réinitialiser le mot de passe avec email, token et nouveau mot de passe
   * @param {string} email - L'email de l'utilisateur
   * @param {string} token - Le token de réinitialisation
   * @param {string} newPassword - Le nouveau mot de passe
   */
  async resetPassword(email, token, newPassword) {
    try {
      console.log('🔐 [Reset Password] Réinitialisation pour:', email);
      
      const response = await axios.post(`${AUTH_API_URL}/auth/reset-password`, {
        email,
        token,
        newPassword
      });
      
      console.log('✅ [Reset Password] Mot de passe réinitialisé avec succès!');
      
      return {
        success: true,
        message: response.data.message || 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      console.error('❌ [Reset Password] Erreur:', error);
      throw error;
    }
  },

  /**
   * Se connecter avec email et mot de passe
   * @param {string} email - L'email de l'utilisateur
   * @param {string} password - Le mot de passe
   */
  async login(email, password) {
    try {
      console.log('🔑 [Login] Tentative de connexion pour:', email);
      
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('✅ [Login] Connexion réussie!');
      
      return response.data;
    } catch (error) {
      console.error('❌ [Login] Erreur:', error);
      throw error;
    }
  }
};

export default authService;
