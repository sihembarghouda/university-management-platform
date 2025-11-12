import React from 'react';

/**
 * Composant de validation de mot de passe
 * Valide : longueur minimale, majuscule, minuscule, chiffre
 */
const PasswordValidator = ({ password, showValidation = true }) => {
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  };

  const allValid = Object.values(validations).every(v => v);

  if (!showValidation || !password) return null;

  // Si tout est valide, ne rien afficher
  if (allValid) {
    return null;
  }

  // Sinon, construire le message d'erreur
  const missing = [];
  if (!validations.length) missing.push('8 caractères');
  if (!validations.uppercase) missing.push('une majuscule');
  if (!validations.lowercase) missing.push('une minuscule');
  if (!validations.number) missing.push('un chiffre');

  return (
    <div style={styles.errorContainer}>
      ⚠️ Il manque : {missing.join(', ')}
    </div>
  );
};

/**
 * Hook pour valider un mot de passe
 */
export const usePasswordValidation = (password) => {
  const validations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password)
  };

  const isValid = Object.values(validations).every(v => v);

  const getErrorMessage = () => {
    if (!validations.minLength) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!validations.hasUpperCase) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!validations.hasLowerCase) return 'Le mot de passe doit contenir au moins une minuscule';
    if (!validations.hasNumber) return 'Le mot de passe doit contenir au moins un chiffre';
    return '';
  };

  return {
    isValid,
    validations,
    errorMessage: getErrorMessage()
  };
};

const styles = {
  successContainer: {
    marginTop: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    border: '1px solid #bbf7d0'
  },
  errorContainer: {
    marginTop: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid #fecaca'
  }
};

export default PasswordValidator;
