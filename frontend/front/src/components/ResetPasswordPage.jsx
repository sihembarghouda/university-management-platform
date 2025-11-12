import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordValidator, { usePasswordValidation } from './PasswordValidator';

// Constantes
const API_BASE_URL = 'http://localhost:3001/api';
const MIN_PASSWORD_LENGTH = 8;
const REDIRECT_DELAY = 3000;

const MESSAGES = {
  SUCCESS: 'Mot de passe réinitialisé avec succès !',
  INVALID_LINK: 'Lien invalide. Veuillez demander un nouveau lien de réinitialisation.',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  PASSWORD_TOO_SHORT: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`,
  ERROR_DEFAULT: 'Une erreur est survenue. Le lien est peut-être expiré.',
  REDIRECT_INFO: 'Redirection automatique dans 3 secondes...',
  HINT: '💡 Conseil : Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.'
};

const ResetPasswordPage = () => {
  // Hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // États
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Validation du mot de passe
  const passwordValidation = usePasswordValidation(formData.newPassword);

  // Initialisation des paramètres URL
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam && tokenParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam,
        token: tokenParam
      }));
    } else {
      setError(MESSAGES.INVALID_LINK);
    }
  }, [searchParams]);

  // Gestionnaires d'événements
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFocus = (field) => () => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const resetMessages = () => {
    setError('');
    setMessage('');
  };

  const validatePasswords = () => {
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errorMessage);
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(MESSAGES.PASSWORD_MISMATCH);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!validatePasswords()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword
      });

      setMessage(response.data.message || MESSAGES.SUCCESS);
      
      setTimeout(() => {
        navigate('/login');
      }, REDIRECT_DELAY);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || MESSAGES.ERROR_DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => navigate('/login');

  const isFormValid = formData.newPassword && formData.confirmPassword && formData.token;
  const isButtonDisabled = loading || !isFormValid;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Header />
        <AlertMessages message={message} error={error} onNavigate={navigateToLogin} />
        
        {!message && (
          <>
            <ResetPasswordForm
              formData={formData}
              loading={loading}
              focusedField={focusedField}
              isButtonHovered={isButtonHovered}
              isButtonDisabled={isButtonDisabled}
              onInputChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onButtonHover={setIsButtonHovered}
            />
            <BackToLogin onClick={navigateToLogin} />
          </>
        )}
      </div>
    </div>
  );
};

// Composants
const Header = () => (
  <div style={styles.header}>
    <div style={styles.iconWrapper}>
      <span style={styles.icon}>🔐</span>
    </div>
    <h1 style={styles.title}>Réinitialiser le mot de passe</h1>
    <p style={styles.description}>
      Entrez votre nouveau mot de passe pour sécuriser votre compte
    </p>
  </div>
);

const AlertMessages = ({ message, error, onNavigate }) => (
  <>
    {message && <SuccessAlert message={message} onNavigate={onNavigate} />}
    {error && <ErrorAlert message={error} />}
  </>
);

const SuccessAlert = ({ message, onNavigate }) => (
  <div style={styles.alertSuccess}>
    <div style={styles.alertContent}>
      <span style={{ ...styles.alertIcon, color: '#155724' }}>✓</span>
      <div style={{ flex: 1 }}>
        <p style={{ ...styles.alertText, color: '#155724', fontWeight: 'bold', marginBottom: '8px' }}>
          {message}
        </p>
        <p style={{ ...styles.alertSubtext, color: '#155724' }}>
          {MESSAGES.REDIRECT_INFO}
        </p>
      </div>
    </div>
    <button onClick={onNavigate} style={styles.successButton}>
      Continuer vers la connexion →
    </button>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div style={styles.alertError}>
    <span style={{ ...styles.alertIcon, color: '#721c24' }}>⚠</span>
    <p style={{ ...styles.alertText, color: '#721c24' }}>{message}</p>
  </div>
);

const ResetPasswordForm = ({
  formData,
  loading,
  focusedField,
  isButtonHovered,
  isButtonDisabled,
  onInputChange,
  onFocus,
  onBlur,
  onSubmit,
  onButtonHover
}) => (
  <form onSubmit={onSubmit}>
    <FormField
      id="email"
      label="Adresse email"
      type="email"
      icon="✉"
      value={formData.email}
      readOnly
    />
    <FormField
      id="newPassword"
      label="Nouveau mot de passe"
      type="password"
      icon="🔑"
      placeholder="Minimum 8 caractères"
      value={formData.newPassword}
      onChange={onInputChange('newPassword')}
      onFocus={onFocus('new')}
      onBlur={onBlur}
      focused={focusedField === 'new'}
      disabled={loading || !formData.token}
      required
      minLength={MIN_PASSWORD_LENGTH}
      hint={MESSAGES.HINT}
    />
    <PasswordValidator password={formData.newPassword} showValidation={formData.newPassword.length > 0} />
    <FormField
      id="confirmPassword"
      label="Confirmer le mot de passe"
      type="password"
      icon="🔐"
      placeholder="Confirmez votre mot de passe"
      value={formData.confirmPassword}
      onChange={onInputChange('confirmPassword')}
      onFocus={onFocus('confirm')}
      onBlur={onBlur}
      focused={focusedField === 'confirm'}
      disabled={loading || !formData.token}
      required
      minLength={MIN_PASSWORD_LENGTH}
    />
    <SubmitButton
      loading={loading}
      disabled={isButtonDisabled}
      hovered={isButtonHovered}
      onHover={onButtonHover}
    />
  </form>
);

const FormField = ({
  id,
  label,
  type,
  icon,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  focused,
  disabled,
  readOnly,
  required,
  minLength,
  hint
}) => (
  <div style={styles.formGroup}>
    <label htmlFor={id} style={styles.label}>{label}</label>
    <div style={styles.inputWrapper}>
      <span style={styles.inputIcon}>{icon}</span>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        minLength={minLength}
        style={{
          ...(readOnly ? styles.inputReadonly : styles.input),
          ...(focused ? styles.inputFocus : {}),
          ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {})
        }}
      />
    </div>
    {hint && <p style={styles.passwordHint}>{hint}</p>}
  </div>
);

const SubmitButton = ({ loading, disabled, hovered, onHover }) => (
  <button
    type="submit"
    disabled={disabled}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
    style={{
      ...styles.button,
      ...(hovered && !disabled ? styles.buttonHover : {}),
      ...(disabled ? styles.buttonDisabled : {})
    }}
  >
    {loading ? (
      <>
        <span style={styles.spinner} />
        <span>Réinitialisation...</span>
      </>
    ) : (
      <span>Réinitialiser le mot de passe</span>
    )}
  </button>
);

const BackToLogin = ({ onClick }) => (
  <div style={styles.backToLoginWrapper}>
    <button onClick={onClick} style={styles.backToLoginButton}>
      ← Retour à la connexion
    </button>
  </div>
);

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '40px',
    width: '100%',
    maxWidth: '500px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    margin: '0 auto 20px',
    backgroundColor: '#667eea',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: '32px',
    color: '#ffffff'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '10px'
  },
  description: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5'
  },
  alertSuccess: {
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px'
  },
  alertContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '15px'
  },
  alertError: {
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  alertIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  alertText: {
    fontSize: '14px',
    margin: 0
  },
  alertSubtext: {
    fontSize: '13px',
    margin: 0
  },
  successButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: '#a0aec0',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 46px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  inputReadonly: {
    width: '100%',
    padding: '14px 14px 14px 46px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    color: '#718096',
    cursor: 'not-allowed'
  },
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    marginTop: '10px'
  },
  buttonHover: {
    backgroundColor: '#5568d3',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  passwordHint: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '6px',
    lineHeight: '1.4'
  },
  backToLoginWrapper: {
    marginTop: '24px',
    textAlign: 'center'
  },
  backToLoginButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px',
    transition: 'all 0.3s ease'
  }
};

export default ResetPasswordPage;