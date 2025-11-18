import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        email,
      });

      setMessage(response.data.message || 'Un email de réinitialisation a été envoyé !');
      setEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      padding: '20px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      padding: '40px',
      width: '100%',
      maxWidth: '450px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    iconWrapper: {
      width: '70px',
      height: '70px',
      margin: '0 auto 20px',
      backgroundColor: '#667eea',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: '32px',
      color: '#ffffff',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '10px',
    },
    description: {
      fontSize: '14px',
      color: '#718096',
      lineHeight: '1.5',
    },
    alertSuccess: {
      padding: '16px',
      marginBottom: '20px',
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    alertError: {
      padding: '16px',
      marginBottom: '20px',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    alertIcon: {
      fontSize: '20px',
      flexShrink: 0,
    },
    alertText: {
      fontSize: '14px',
      margin: 0,
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      color: '#a0aec0',
      pointerEvents: 'none',
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
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
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
    },
    buttonHover: {
      backgroundColor: '#5568d3',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
    },
    buttonDisabled: {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    backLink: {
      marginTop: '24px',
      textAlign: 'center',
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px',
      transition: 'all 0.2s ease',
    },
    backButtonHover: {
      color: '#5568d3',
      textDecoration: 'underline',
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '12px',
      color: '#a0aec0',
      lineHeight: '1.5',
    },
    spinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: '#ffffff',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>✉️</span>
            </div>
            <h1 style={styles.title}>Mot de passe oublié ?</h1>
            <p style={styles.description}>
              Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {message && (
            <div style={styles.alertSuccess}>
              <span style={{...styles.alertIcon, color: '#155724'}}>✓</span>
              <p style={{...styles.alertText, color: '#155724'}}>{message}</p>
            </div>
          )}

          {error && (
            <div style={styles.alertError}>
              <span style={{...styles.alertIcon, color: '#721c24'}}>⚠</span>
              <p style={{...styles.alertText, color: '#721c24'}}>{error}</p>
            </div>
          )}

          <div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Adresse email
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="votre.email@example.com"
                  disabled={loading}
                  style={{
                    ...styles.input,
                    ...(isFocused ? styles.inputFocus : {}),
                    ...(loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              style={{
                ...styles.button,
                ...(isButtonHovered && !loading && email ? styles.buttonHover : {}),
                ...(loading || !email ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Envoyer le lien de réinitialisation</span>
              )}
            </button>
          </div>

          <div style={styles.backLink}>
            <button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setIsBackHovered(true)}
              onMouseLeave={() => setIsBackHovered(false)}
              style={{
                ...styles.backButton,
                ...(isBackHovered ? styles.backButtonHover : {}),
              }}
            >
              <span>← Retour à la connexion</span>
            </button>
          </div>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Si vous ne recevez pas l'email dans les 5 minutes, vérifiez votre dossier spam ou contactez le support.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;