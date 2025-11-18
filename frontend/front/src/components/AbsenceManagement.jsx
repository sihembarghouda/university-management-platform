import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AbsenceManagement.css';

const API_URL = 'http://localhost:3002';

const AbsenceManagement = () => {
  const [absences, setAbsences] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [etudiantsRisque, setEtudiantsRisque] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('liste');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    etudiantId: '',
    matiereId: '',
    dateAbsence: '',
    heureDebut: '',
    heureFin: '',
    nbHeures: 1,
    commentaire: ''
  });

  const [justificationForm, setJustificationForm] = useState({
    typeJustificatif: 'maladie',
    motifJustification: '',
    pieceJustificative: ''
  });

  const [rattrapageForm, setRattrapageForm] = useState({
    dateRattrapage: '',
    heureRattrapage: ''
  });

  useEffect(() => {
    loadData();
    loadEtudiants();
    loadMatieres();
    loadStatistiques();
    loadEtudiantsRisque();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/absences`);
      setAbsences(response.data);
    } catch (error) {
      console.error('Erreur chargement absences:', error);
      showNotification('Erreur lors du chargement des absences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadEtudiants = async () => {
    try {
      const response = await axios.get(`${API_URL}/etudiants`);
      setEtudiants(response.data);
    } catch (error) {
      console.error('Erreur chargement étudiants:', error);
    }
  };

  const loadMatieres = async () => {
    try {
      const response = await axios.get(`${API_URL}/matieres`);
      setMatieres(response.data);
    } catch (error) {
      console.error('Erreur chargement matières:', error);
    }
  };

  const loadStatistiques = async () => {
    try {
      const response = await axios.get(`${API_URL}/absences/statistiques`);
      setStatistiques(response.data);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const loadEtudiantsRisque = async () => {
    try {
      const response = await axios.get(`${API_URL}/absences/etudiants-a-risque`);
      setEtudiantsRisque(response.data);
    } catch (error) {
      console.error('Erreur chargement étudiants à risque:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const etudiant = etudiants.find(e => e.id === Number(formData.etudiantId));
      const matiere = matieres.find(m => m.id === Number(formData.matiereId));
      
      const dataToSend = {
        ...formData,
        etudiantId: Number(formData.etudiantId),
        matiereId: Number(formData.matiereId),
        nbHeures: Number(formData.nbHeures),
        etudiantNom: etudiant?.nom,
        etudiantPrenom: etudiant?.prenom,
        matiereNom: matiere?.nom
      };

      if (editingItem) {
        await axios.patch(`${API_URL}/absences/${editingItem.id}`, dataToSend);
        showNotification('Absence modifiée avec succès');
      } else {
        await axios.post(`${API_URL}/absences`, dataToSend);
        showNotification('Absence enregistrée avec succès');
      }
      
      resetForm();
      loadData();
      loadStatistiques();
      loadEtudiantsRisque();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      etudiantId: item.etudiantId,
      matiereId: item.matiereId,
      dateAbsence: item.dateAbsence.split('T')[0],
      heureDebut: item.heureDebut || '',
      heureFin: item.heureFin || '',
      nbHeures: item.nbHeures,
      commentaire: item.commentaire || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/absences/${id}`);
      showNotification('Absence supprimée');
      loadData();
      loadStatistiques();
      loadEtudiantsRisque();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la suppression', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJustifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/absences/${selectedAbsence.id}/justifier`, justificationForm);
      showNotification('Justification envoyée');
      setSelectedAbsence(null);
      resetJustificationForm();
      loadData();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la justification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleValiderJustification = async (id, accepter) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/absences/${id}/valider-justification`, { accepter });
      showNotification(accepter ? 'Justification acceptée' : 'Justification refusée');
      loadData();
      loadStatistiques();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la validation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanifierRattrapage = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/absences/${selectedAbsence.id}/planifier-rattrapage`, rattrapageForm);
      showNotification('Rattrapage planifié');
      setSelectedAbsence(null);
      resetRattrapageForm();
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la planification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerRattrapageEffectue = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/absences/${id}/rattrapage-effectue`);
      showNotification('Rattrapage marqué comme effectué');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnvoyerAlerte = async (id) => {
    if (!window.confirm('Envoyer une alerte d\'élimination pour cette absence ?')) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/absences/${id}/envoyer-alerte`);
      showNotification('Alerte envoyée');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de l\'envoi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      etudiantId: '',
      matiereId: '',
      dateAbsence: '',
      heureDebut: '',
      heureFin: '',
      nbHeures: 1,
      commentaire: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const resetJustificationForm = () => {
    setJustificationForm({
      typeJustificatif: 'maladie',
      motifJustification: '',
      pieceJustificative: ''
    });
  };

  const resetRattrapageForm = () => {
    setRattrapageForm({
      dateRattrapage: '',
      heureRattrapage: ''
    });
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'non_justifiee': { text: 'Non justifiée', class: 'badge-danger' },
      'justifiee': { text: 'Justifiée', class: 'badge-success' },
      'en_attente': { text: 'En attente', class: 'badge-warning' },
      'refusee': { text: 'Refusée', class: 'badge-error' }
    };
    const badge = badges[statut] || { text: statut, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="absence-management">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="absence-header">
        <h1>📅 Gestion des Absences</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Enregistrer une absence
        </button>
      </div>

      {/* Statistiques */}
      {statistiques && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{statistiques.total}</div>
            <div className="stat-label">Total absences</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-value">{statistiques.nonJustifiees}</div>
            <div className="stat-label">Non justifiées</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value">{statistiques.enAttente}</div>
            <div className="stat-label">En attente</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value">{statistiques.justifiees}</div>
            <div className="stat-label">Justifiées</div>
          </div>
          <div className="stat-card info">
            <div className="stat-value">{statistiques.avecRattrapage}</div>
            <div className="stat-label">Rattrapages</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="absence-tabs">
        <button 
          className={activeTab === 'liste' ? 'active' : ''} 
          onClick={() => setActiveTab('liste')}
        >
          📋 Liste des absences
        </button>
        <button 
          className={activeTab === 'risque' ? 'active' : ''} 
          onClick={() => setActiveTab('risque')}
        >
          ⚠️ Étudiants à risque ({etudiantsRisque.length})
        </button>
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Modifier l\'absence' : 'Enregistrer une absence'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Étudiant *</label>
                  <select
                    value={formData.etudiantId}
                    onChange={(e) => setFormData({...formData, etudiantId: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner un étudiant</option>
                    {etudiants.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.nom} {e.prenom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Matière *</label>
                  <select
                    value={formData.matiereId}
                    onChange={(e) => setFormData({...formData, matiereId: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {matieres.map(m => (
                      <option key={m.id} value={m.id}>{m.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.dateAbsence}
                    onChange={(e) => setFormData({...formData, dateAbsence: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nombre d'heures *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.nbHeures}
                    onChange={(e) => setFormData({...formData, nbHeures: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Heure début</label>
                  <input
                    type="time"
                    value={formData.heureDebut}
                    onChange={(e) => setFormData({...formData, heureDebut: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Heure fin</label>
                  <input
                    type="time"
                    value={formData.heureFin}
                    onChange={(e) => setFormData({...formData, heureFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Commentaire</label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : editingItem ? 'Modifier' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Justification */}
      {selectedAbsence && selectedAbsence.action === 'justifier' && (
        <div className="modal-overlay" onClick={() => setSelectedAbsence(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Justifier l'absence</h2>
              <button className="modal-close" onClick={() => setSelectedAbsence(null)}>✕</button>
            </div>
            <form onSubmit={handleJustifier}>
              <div className="form-group">
                <label>Type de justificatif *</label>
                <select
                  value={justificationForm.typeJustificatif}
                  onChange={(e) => setJustificationForm({...justificationForm, typeJustificatif: e.target.value})}
                  required
                >
                  <option value="maladie">Maladie</option>
                  <option value="personnel">Personnel</option>
                  <option value="administratif">Administratif</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Motif *</label>
                <textarea
                  value={justificationForm.motifJustification}
                  onChange={(e) => setJustificationForm({...justificationForm, motifJustification: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pièce justificative (URL)</label>
                <input
                  type="text"
                  value={justificationForm.pieceJustificative}
                  onChange={(e) => setJustificationForm({...justificationForm, pieceJustificative: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setSelectedAbsence(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rattrapage */}
      {selectedAbsence && selectedAbsence.action === 'rattrapage' && (
        <div className="modal-overlay" onClick={() => setSelectedAbsence(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Planifier un rattrapage</h2>
              <button className="modal-close" onClick={() => setSelectedAbsence(null)}>✕</button>
            </div>
            <form onSubmit={handlePlanifierRattrapage}>
              <div className="form-group">
                <label>Date de rattrapage *</label>
                <input
                  type="date"
                  value={rattrapageForm.dateRattrapage}
                  onChange={(e) => setRattrapageForm({...rattrapageForm, dateRattrapage: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Heure *</label>
                <input
                  type="time"
                  value={rattrapageForm.heureRattrapage}
                  onChange={(e) => setRattrapageForm({...rattrapageForm, heureRattrapage: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setSelectedAbsence(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Planification...' : 'Planifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absence-content">
        {activeTab === 'liste' && (
          <div className="data-grid">
            {loading && absences.length === 0 ? (
              <div className="loading">Chargement...</div>
            ) : absences.length === 0 ? (
              <div className="empty-state">Aucune absence enregistrée</div>
            ) : (
              absences.map(absence => (
                <div key={absence.id} className="data-card">
                  <div className="card-header">
                    <h3>{absence.etudiantNom} {absence.etudiantPrenom}</h3>
                    {getStatutBadge(absence.statut)}
                  </div>
                  
                  <div className="card-body">
                    <p><strong>Matière:</strong> {absence.matiereNom}</p>
                    <p><strong>Date:</strong> {new Date(absence.dateAbsence).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Heures:</strong> {absence.nbHeures}h 
                      {absence.heureDebut && ` (${absence.heureDebut} - ${absence.heureFin})`}
                    </p>
                    
                    {absence.commentaire && (
                      <p className="comment"><strong>Commentaire:</strong> {absence.commentaire}</p>
                    )}
                    
                    {absence.motifJustification && (
                      <div className="justification-info">
                        <p><strong>Type:</strong> {absence.typeJustificatif}</p>
                        <p><strong>Motif:</strong> {absence.motifJustification}</p>
                        {absence.pieceJustificative && (
                          <p><strong>Pièce:</strong> <a href={absence.pieceJustificative} target="_blank" rel="noopener noreferrer">Voir</a></p>
                        )}
                      </div>
                    )}
                    
                    {absence.rattrapage && (
                      <div className="rattrapage-info">
                        <p>🔄 <strong>Rattrapage:</strong> {new Date(absence.dateRattrapage).toLocaleDateString('fr-FR')} à {absence.heureRattrapage}</p>
                        {absence.rattrapageEffectue && <span className="badge badge-success">✓ Effectué</span>}
                      </div>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-edit-small" onClick={() => handleEdit(absence)} title="Modifier">
                      ✏️
                    </button>
                    <button className="btn-delete-small" onClick={() => handleDelete(absence.id)} title="Supprimer">
                      🗑️
                    </button>
                    
                    {absence.statut === 'non_justifiee' && (
                      <button 
                        className="btn-action" 
                        onClick={() => setSelectedAbsence({...absence, action: 'justifier'})}
                        title="Justifier"
                      >
                        📝
                      </button>
                    )}
                    
                    {absence.statut === 'en_attente' && (
                      <>
                        <button 
                          className="btn-success-small" 
                          onClick={() => handleValiderJustification(absence.id, true)}
                          title="Accepter"
                        >
                          ✓
                        </button>
                        <button 
                          className="btn-danger-small" 
                          onClick={() => handleValiderJustification(absence.id, false)}
                          title="Refuser"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    
                    {!absence.rattrapage && absence.statut === 'non_justifiee' && (
                      <button 
                        className="btn-warning-small" 
                        onClick={() => setSelectedAbsence({...absence, action: 'rattrapage'})}
                        title="Planifier rattrapage"
                      >
                        🔄
                      </button>
                    )}
                    
                    {absence.rattrapage && !absence.rattrapageEffectue && (
                      <button 
                        className="btn-info-small" 
                        onClick={() => handleMarquerRattrapageEffectue(absence.id)}
                        title="Marquer effectué"
                      >
                        ✔️
                      </button>
                    )}
                    
                    {!absence.alerteEliminationEnvoyee && absence.statut === 'non_justifiee' && (
                      <button 
                        className="btn-alert" 
                        onClick={() => handleEnvoyerAlerte(absence.id)}
                        title="Envoyer alerte"
                      >
                        🚨
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'risque' && (
          <div className="risque-container">
            {etudiantsRisque.length === 0 ? (
              <div className="empty-state success">✓ Aucun étudiant à risque d'élimination</div>
            ) : (
              <div className="data-grid">
                {etudiantsRisque.map((item, idx) => (
                  <div key={idx} className="data-card risque-card">
                    <div className="card-header">
                      <h3>⚠️ {item.etudiantNom} {item.etudiantPrenom}</h3>
                      <span className="badge badge-danger">{item.pourcentage}%</span>
                    </div>
                    <div className="card-body">
                      <p><strong>Matière:</strong> {item.matiereNom}</p>
                      <p><strong>Total heures d'absence:</strong> {item.totalHeures}h</p>
                      <p><strong>Nombre d'absences:</strong> {item.absences.length}</p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${Math.min(item.pourcentage, 100)}%`}}
                        ></div>
                      </div>
                      <p className="warning-text">
                        ⚠️ Seuil d'élimination atteint (25%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsenceManagement;
