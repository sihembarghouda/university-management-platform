import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emploiService from '../services/emploiService';
import absenceService from '../services/absenceService';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const SessionAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuth();
  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      const data = await emploiService.getSession(id);
      setSession(data);
      // ensure etudiants is array of {id, nom, prenom}
      setStudents((data.etudiants || []).map((e) => ({ ...e, present: true })));
    } catch (err) {
      console.error('Erreur chargement séance', err);
      alert('Impossible de charger la séance. Vérifiez l\'ID ou le backend.');
      navigate('/teacher-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const togglePresent = (idx) => {
    const copy = [...students];
    copy[idx].present = !copy[idx].present;
    setStudents(copy);
  };

  const submitAttendance = async () => {
    if (!window.confirm('Confirmer l\'envoi de la prise d\'appel ?')) return;
    setSubmitting(true);
    try {
      const payload = students.map((s) => ({ etudiantId: s.id || s.etudiantId, present: !!s.present }));
      const res = await absenceService.postAttendance(id, payload);
      alert(`Créés: ${res.count || (res.created && res.created.length) || 0}`);
      navigate('/teacher-dashboard');
    } catch (err) {
      console.error('Erreur envoi prise d\'appel', err);
      alert('Erreur lors de l\'envoi de la prise d\'appel');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Chargement de la séance...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Prise d'appel — Séance #{id}</h2>
        <div>
          <strong>Matière:</strong> {session?.matiere} <br />
          <strong>Classe:</strong> {session?.classe} <br />
          <strong>Heure:</strong> {session?.heureDebut} - {session?.heureFin}
        </div>
      </header>

      <div className="dashboard-content">
        <section>
          <h3>Étudiants</h3>
          <table className="table">
            <thead>
              <tr><th>#</th><th>Nom</th><th>Présent</th></tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{s.nom || s.etudiantNom || ''} {s.prenom || s.etudiantPrenom || ''}</td>
                  <td>
                    <input type="checkbox" checked={!!s.present} onChange={() => togglePresent(i)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={submitAttendance} disabled={submitting}>
              {submitting ? 'Envoi...' : 'Enregistrer la prise d\'appel'}
            </button>
            <button className="btn-secondary" onClick={() => navigate('/teacher-dashboard')} style={{ marginLeft: 8 }}>
              Annuler
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SessionAttendance;
