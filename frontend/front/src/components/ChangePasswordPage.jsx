import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PasswordValidator, { usePasswordValidation } from "./PasswordValidator";

// Constantes pour les messages
const MESSAGES = {
  SUCCESS: "Mot de passe changé avec succès ! Redirection...",
  ERROR_DEFAULT: "Erreur lors du changement de mot de passe",
  HINT: "💡 Conseil : Utilisez au moins 8 caractères avec des lettres, chiffres et symboles."
};

// Constantes pour les délais
const REDIRECT_DELAY = 2000;

// Utilitaire pour obtenir la route selon le rôle
const getDashboardRoute = (role) => {
  const routes = {
    etudiant: "/student-dashboard",
    enseignant: "/teacher-dashboard",
    directeur_departement: "/director-dashboard",
    administratif: "/admin-dashboard"
  };
  return routes[role] || "/dashboard";
};

const ChangePasswordPage = () => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { changePassword } = useAuth();

  // États
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    currentPassword: "",
    newPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // Validation du mot de passe
  const passwordValidation = usePasswordValidation(formData.newPassword);

  // Gestionnaires d'événements
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFocus = (field) => () => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const redirectToDashboard = (role) => {
    setTimeout(() => {
      navigate(getDashboardRoute(role));
    }, REDIRECT_DELAY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    
    // Vérifier la validation du mot de passe
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errorMessage);
      return;
    }
    
    setLoading(true);

    try {
      const result = await changePassword(
        formData.email,
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        setSuccess(MESSAGES.SUCCESS);
        redirectToDashboard(result.user?.role);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || MESSAGES.ERROR_DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.currentPassword && formData.newPassword && passwordValidation.isValid;
  const isButtonDisabled = loading || !isFormValid;

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          <Header />
          <AlertMessages success={success} error={error} />
          <PasswordForm
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
        </div>
      </div>
    </>
  );
};

// Composants
const Header = () => (
  <div style={styles.header}>
    <div style={styles.iconWrapper}>
      <span style={styles.icon}>🔒</span>
    </div>
    <h1 style={styles.title}>Changer votre mot de passe</h1>
    <p style={styles.description}>
      Pour votre sécurité, veuillez entrer votre ancien mot de passe et choisir un nouveau mot de passe sécurisé.
    </p>
  </div>
);

const AlertMessages = ({ success, error }) => (
  <>
    {success && <Alert type="success" message={success} />}
    {error && <Alert type="error" message={error} />}
  </>
);

const Alert = ({ type, message }) => {
  const isSuccess = type === "success";
  return (
    <div style={isSuccess ? styles.alertSuccess : styles.alertError}>
      <span style={{ ...styles.alertIcon, color: isSuccess ? '#155724' : '#721c24' }}>
        {isSuccess ? '✓' : '⚠'}
      </span>
      <p style={{ ...styles.alertText, color: isSuccess ? '#155724' : '#721c24' }}>
        {message}
      </p>
    </div>
  );
};

const PasswordForm = ({
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
      id="currentPassword"
      label="Ancien mot de passe"
      type="password"
      icon="🔑"
      placeholder="Votre ancien mot de passe"
      value={formData.currentPassword}
      onChange={onInputChange('currentPassword')}
      onFocus={onFocus('current')}
      onBlur={onBlur}
      focused={focusedField === 'current'}
      disabled={loading}
      required
    />
    <FormField
      id="newPassword"
      label="Nouveau mot de passe"
      type="password"
      icon="🔐"
      placeholder="Votre nouveau mot de passe"
      value={formData.newPassword}
      onChange={onInputChange('newPassword')}
      onFocus={onFocus('new')}
      onBlur={onBlur}
      focused={focusedField === 'new'}
      disabled={loading}
      required
      hint={MESSAGES.HINT}
    />
    <PasswordValidator password={formData.newPassword} showValidation={formData.newPassword.length > 0} />
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
        <span>Changement en cours...</span>
      </>
    ) : (
      <span>Changer le mot de passe</span>
    )}
  </button>
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
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
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
  }
};

export default ChangePasswordPage;