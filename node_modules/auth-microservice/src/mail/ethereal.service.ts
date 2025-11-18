import * as nodemailer from 'nodemailer';

/**
 * Service pour créer un compte de test Ethereal Email automatiquement
 * Ethereal est un service SMTP de test gratuit
 */
export async function createTestEmailAccount() {
  try {
    // Créer un compte de test Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('📧 ========================================');
    console.log('📧 Compte Email de Test Créé (Ethereal)');
    console.log('📧 ========================================');
    console.log('📧 Host:', testAccount.smtp.host);
    console.log('📧 Port:', testAccount.smtp.port);
    console.log('📧 User:', testAccount.user);
    console.log('📧 Pass:', testAccount.pass);
    console.log('📧 ========================================');
    console.log('💡 Les emails seront capturés sur: https://ethereal.email');
    console.log('💡 Connectez-vous avec:', testAccount.user, '/', testAccount.pass);
    console.log('📧 ========================================');
    
    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      user: testAccount.user,
      pass: testAccount.pass,
      webUrl: 'https://ethereal.email'
    };
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte email de test:', error);
    return null;
  }
}

/**
 * Obtenir l'URL pour voir l'email envoyé sur Ethereal
 */
export function getMessageUrl(info: any): string | false {
  return nodemailer.getTestMessageUrl(info);
}
