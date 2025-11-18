import { 
  confirmPasswordReset, 
  verifyPasswordResetCode,
  applyActionCode,
  checkActionCode,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:3000/api';

/**
 * Service pour gérer l'authentification Firebase
 */
const firebaseAuthService = {
  /**
   * Demander un lien de réinitialisation de mot de passe
   * Utilise le BACKEND qui génère le lien Firebase avec le bon domaine
   * Le backend s'assure que l'utilisateur existe dans Firebase
   */
  async requestPasswordReset(email) {
    try {
      console.log('🔥 [Password Reset] Demande de réinitialisation pour:', email);
      
      // Appeler le backend qui va:
      // 1. Créer l'utilisateur dans Firebase si nécessaire
      // 2. Générer un lien Firebase avec le bon domaine (localhost:3003)
      // 3. Envoyer l'email avec ce lien
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
   * Vérifier si le code de réinitialisation Firebase est valide
   * @param {string} oobCode - Le code d'action Firebase (oobCode)
   * @returns {Promise<string>} - L'email associé au code
   */
  async verifyPasswordResetCode(oobCode) {
    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      console.log('✅ Password reset code verified for:', email);
      return email;
    } catch (error) {
      console.error('❌ Error verifying password reset code:', error);
      throw error;
    }
  },

  /**
   * Réinitialiser le mot de passe avec Firebase
   * @param {string} oobCode - Le code d'action Firebase
   * @param {string} newPassword - Le nouveau mot de passe
   */
  async confirmPasswordReset(oobCode, newPassword) {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('✅ Password reset successful via Firebase');
      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      console.error('❌ Error confirming password reset:', error);
      throw error;
    }
  },

  /**
   * Réinitialiser le mot de passe avec le backend (fallback si pas de Firebase)
   * @param {string} email - Email de l'utilisateur
   * @param {string} token - Token de réinitialisation local
   * @param {string} newPassword - Le nouveau mot de passe
   */
  async resetPasswordWithToken(email, token, newPassword) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/reset-password`, {
        email,
        token,
        newPassword
      });
      return {
        success: true,
        message: response.data.message || 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      console.error('Error resetting password with token:', error);
      throw error;
    }
  },

  /**
   * Vérifier le type d'action Firebase (reset password, verify email, etc.)
   * @param {string} oobCode - Le code d'action Firebase
   */
  async checkActionCode(oobCode) {
    try {
      const info = await checkActionCode(auth, oobCode);
      console.log('✅ Action code info:', info);
      return info;
    } catch (error) {
      console.error('❌ Error checking action code:', error);
      throw error;
    }
  },

  /**
   * Appliquer une action Firebase (par exemple, vérifier l'email)
   * @param {string} oobCode - Le code d'action Firebase
   */
  async applyActionCode(oobCode) {
    try {
      await applyActionCode(auth, oobCode);
      console.log('✅ Action code applied successfully');
      return {
        success: true,
        message: 'Action appliquée avec succès'
      };
    } catch (error) {
      console.error('❌ Error applying action code:', error);
      throw error;
    }
  }
};

export default firebaseAuthService;
