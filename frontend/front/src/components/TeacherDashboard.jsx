import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageSquare, 
  LogOut, 
  User, 
  Edit,
  BarChart3,
  GraduationCap,
  UserX,
  Trash2,
  Bell,
  X
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [absencesData, setAbsencesData] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [justificationRequests, setJustificationRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceData, setAbsenceData] = useState({
    matiereNom: '',
    date: '',
    motif: ''
  });
  const [matieres, setMatieres] = useState([]);
  const [loadingMatieres, setLoadingMatieres] = useState(false);
  const [profileData, setProfileData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    departement: user?.departement?.nom || "",
    specialite: user?.specialite || "",
  });

  useEffect(() => {
    loadDashboardData();
    loadAbsencesData();
    loadJustificationRequests();
    loadMatieres();
  }, []);

  const loadDashboardData = async () => {
    setTimeout(() => {
      const data = {
        title: "Espace Enseignant",
        stats: [
          { 
            label: "Mes cours", 
            value: "4", 
            color: "blue",
            description: "Cours actifs"
          },
          { 
            label: "Étudiants", 
            value: "156", 
            color: "green",
            description: "Total inscrits"
          },
          { 
            label: "Évaluations", 
            value: "12", 
            color: "orange",
            description: "En attente"
          },
          { 
            label: "Réussite", 
            value: "87%", 
            color: "purple",
            description: "Taux moyen"
          },
        ],
        quickActions: [
          { 
            title: "Mon Emploi du Temps", 
            description: "Consulter mon planning hebdomadaire",
            action: "viewSchedule",
          },
          { 
            title: "Évaluer les Étudiants", 
            description: "Saisir les notes et évaluations",
            action: "gradeStudents",
          },
          { 
            title: "Mes Statistiques", 
            description: "Analyser les performances",
            action: "statistics",
          },
        ],
      };
      setDashboardData(data);
      setLoading(false);
    }, 800);
  };

  const loadAbsencesData = async () => {
    setLoadingAbsences(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/attendance/teacher/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAbsencesData(data);
      } else {
        console.error('Erreur lors du chargement des absences');
        setAbsencesData([]);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setAbsencesData([]);
    } finally {
      setLoadingAbsences(false);
    }
  };

  const loadJustificationRequests = async () => {
    setLoadingRequests(true);
    try {
      const token = localStorage.getItem('token');
      // Récupérer les absences avec statut EN_ATTENTE pour les matières enseignées par ce professeur
      const response = await fetch('http://localhost:3003/absences?type=etudiant', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const allAbsences = await response.json();
        // Filtrer les absences en attente pour les matières de ce professeur
        const pendingRequests = allAbsences.filter(absence => 
          absence.statut === 'en_attente' && absence.matiereId
        );
        setJustificationRequests(pendingRequests);
      } else {
        console.error('Erreur lors du chargement des demandes');
        setJustificationRequests([]);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setJustificationRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleJustificationDecision = async (absenceId, accept) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/absences/${absenceId}/valider-justification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepter: accept }),
      });

      if (response.ok) {
        alert(accept ? 'Demande de justification approuvée' : 'Demande de justification refusée');
        loadJustificationRequests(); // Recharger les demandes
        loadAbsencesData(); // Recharger les absences
      } else {
        const error = await response.text();
        alert('Erreur: ' + error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur réseau');
    }
  };

  const deleteAbsence = async (absenceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/attendance/${absenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Recharger les données après suppression
        loadAbsencesData();
        alert('Absence supprimée avec succès');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la suppression:', errorData);
        alert('Erreur lors de la suppression de l\'absence');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de la suppression');
    }
  };

  const handleDeleteAbsence = async (absenceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/attendance/${absenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Recharger les données après suppression
        loadAbsencesData();
        alert('Absence supprimée avec succès');
      } else {
        console.error('Erreur lors de la suppression');
        alert('Erreur lors de la suppression de l\'absence');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de la suppression');
    }
  };

  const handleAction = (action) => {
    setActiveNav(action);
    switch (action) {
      case "dashboard":
        break;
      case "manageCourses":
        alert("Ouverture de la gestion des cours...");
        break;
      case "gradeStudents":
        alert("Ouverture des évaluations...");
        break;
      case "viewSchedule":
        navigate("/my-schedule");
        break;
      case "statistics":
        alert("Ouverture des statistiques...");
        break;
      case "messaging":
        navigate('/messagerie');
        break;
      case "absences":
        loadAbsencesData();
        break;
      case "resources":
        alert("Ouverture des ressources pédagogiques...");
        break;
      case "profile":
        // Le profil s'ouvre dans le contenu principal
        break;
      default:
        alert(`Action ${action} non implémentée`);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData.prenom || !profileData.nom || !profileData.email) {
      // Validation silencieuse - les champs requis sont marqués avec *
      return;
    }

    try {
      const response = await updateUser({
        nom: profileData.nom,
        prenom: profileData.prenom,
        cin: user.cin,
      });

      if (response.success) {
        setEditingProfile(false);
        setProfileData({
          ...profileData,
          prenom: response.user.prenom,
          nom: response.user.nom,
        });
        // Mise à jour réussie - pas d'alert
      } else {
        // Erreur silencieuse - l'utilisateur voit que rien ne change
        console.error("Erreur lors de la mise à jour du profil:", response.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      // Erreur silencieuse
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
      navigate("/");
    }
  };

  const loadMatieres = async () => {
    console.log('📚 Chargement des matières...');
    setLoadingMatieres(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token présent:', !!token);
      const response = await fetch('http://localhost:3002/matiere', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 Réponse API matières:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Données matières reçues:', data);
        console.log('📊 Nombre de matières:', data.length);
        // Afficher toutes les matières pour les demandes d'absence
        setMatieres(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API matières:', response.status, errorText);
        setMatieres([]);
      }
    } catch (error) {
      console.error('❌ Erreur réseau chargement matières:', error);
      setMatieres([]);
    } finally {
      setLoadingMatieres(false);
    }
  };

  const handleSignalAbsence = async () => {
    if (!absenceData.matiereNom || !absenceData.date || !absenceData.motif) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Find the matiereId from matiereNom
      const selectedMatiere = matieres.find(m => m.nom === absenceData.matiereNom);
      if (!selectedMatiere) {
        alert('Matière non trouvée');
        return;
      }

      const response = await fetch('http://localhost:3003/absences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matiereId: selectedMatiere.id,
          dateAbsence: absenceData.date,
          motif: absenceData.motif
        }),
      });

      if (response.ok) {
        alert('Demande d\'absence envoyée avec succès');
        setShowAbsenceModal(false);
        setAbsenceData({ matiereNom: '', date: '', motif: '' });
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'envoi:', errorData);
        alert('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors de l\'envoi');
    }
  };

  // Rendu de la page Absences
  const renderAbsences = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Suivi des Absences</h2>
            <p className="text-gray-600 mt-1">Consultez les absences de vos étudiants</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadJustificationRequests}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Bell size={18} />
              Demandes ({justificationRequests.length})
            </button>
            <button
              onClick={() => setShowAbsenceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <UserX size={18} />
              Signaler Absence
            </button>
          </div>
        </div>

        {/* Section Demandes de justification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            Demandes de justification en attente
          </h3>

          {loadingRequests ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="w-6 h-6 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Chargement des demandes...</p>
              </div>
            </div>
          ) : justificationRequests.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Aucune demande de justification en attente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {justificationRequests.map((request, index) => (
                <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {request.etudiantNom} {request.etudiantPrenom}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.matiereNom} - {new Date(request.dateAbsence).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-600">{request.horaire}</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      En attente
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Type: {request.typeJustificatif}</p>
                    <p className="text-sm text-gray-600 mt-1">{request.motifJustification}</p>
                    {request.pieceJustificative && (
                      <p className="text-sm text-blue-600 mt-1">
                        📎 Pièce justificative: {request.pieceJustificative}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleJustificationDecision(request.id, true)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      ✓ Approuver
                    </button>
                    <button
                      onClick={() => handleJustificationDecision(request.id, false)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      ✗ Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {loadingAbsences ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des absences...</p>
            </div>
          </div>
        ) : absencesData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune absence trouvée</h3>
            <p className="text-gray-600">Il n'y a pas encore d'absences enregistrées pour vos cours.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Historique des absences</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {absencesData.map((absence, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {absence.etudiant_prenom?.charAt(0)}{absence.etudiant_nom?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {absence.etudiant_prenom} {absence.etudiant_nom}
                            </div>
                            <div className="text-sm text-gray-500">{absence.etudiant_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{absence.matiere_nom}</div>
                        <div className="text-sm text-gray-500">{absence.classe_nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(absence.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          absence.statut === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {absence.statut === 'absent' ? 'Absent' : 'Présent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteAbsence(absence.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Supprimer cette absence"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Rendu de la page Profil
  const renderProfile = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User size={48} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user?.prenom} {user?.nom}</h2>
                <p className="text-blue-100 mt-1">Enseignant</p>
                <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Contenu du profil */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Informations personnelles</h3>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={18} />
                  Modifier
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={profileData.nom}
                  onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                  disabled={!editingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={profileData.prenom}
                  onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                  disabled={!editingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!editingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                  disabled={!editingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                <input
                  type="text"
                  value={profileData.departement || "Chargement..."}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                <input
                  type="text"
                  value={profileData.specialite || "Non spécifiée"}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {editingProfile && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleProfileUpdate();
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Enregistrer les modifications
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getStatColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">ISET Tozeur</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Menu Principal */}
          <div>
            <div className="text-xs font-semibold text-blue-300 uppercase mb-2">Menu Principal</div>
            <button
              onClick={() => handleAction('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeNav === 'dashboard' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm font-medium">Tableau de bord</span>
            </button>

            <button
              onClick={() => handleAction('viewSchedule')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'viewSchedule' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <Calendar size={20} />
              <span className="text-sm font-medium">Mon Emploi du Temps</span>
            </button>
          </div>

          {/* Cours & Étudiants */}
          <div>
            <div className="text-xs font-semibold text-blue-300 uppercase mb-2">Cours & Étudiants</div>
            <button
              onClick={() => handleAction('manageCourses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeNav === 'manageCourses' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <BookOpen size={20} />
              <span className="text-sm font-medium">Mes cours</span>
            </button>

            <button
              onClick={() => handleAction('gradeStudents')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'gradeStudents' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <GraduationCap size={20} />
              <span className="text-sm font-medium">Évaluations</span>
            </button>

            <button
              onClick={() => handleAction('statistics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'statistics' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <BarChart3 size={20} />
              <span className="text-sm font-medium">Statistiques</span>
            </button>
          </div>

          {/* Outils */}
          <div>
            <div className="text-xs font-semibold text-blue-300 uppercase mb-2">Outils</div>
            <button
              onClick={() => handleAction('absences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeNav === 'absences' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <UserX size={20} />
              <span className="text-sm font-medium">Suivi des Absences</span>
            </button>

            <button
              onClick={() => handleAction('messaging')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'messaging' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <MessageSquare size={20} />
              <span className="text-sm font-medium">Messagerie</span>
            </button>

            <button
              onClick={() => handleAction('resources')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'resources' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <GraduationCap size={20} />
              <span className="text-sm font-medium">Ressources</span>
            </button>

            <button
              onClick={() => handleAction('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-2 ${
                activeNav === 'profile' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-800'
              }`}
            >
              <User size={20} />
              <span className="text-sm font-medium">Mon Profil</span>
            </button>
          </div>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-blue-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeNav === 'dashboard' && 'Tableau de bord'}
                {activeNav === 'viewSchedule' && 'Mon Emploi du Temps'}
                {activeNav === 'manageCourses' && 'Mes Cours'}
                {activeNav === 'gradeStudents' && 'Évaluations'}
                {activeNav === 'absences' && 'Suivi des Absences'}
                {activeNav === 'statistics' && 'Statistiques'}
                {activeNav === 'messaging' && 'Messagerie'}
                {activeNav === 'resources' && 'Ressources'}
                {activeNav === 'profile' && 'Mon Profil'}
              </h2>
              <p className="text-sm text-gray-500">
                {activeNav === 'dashboard' && 'Bienvenue dans votre espace enseignant'}
                {activeNav === 'viewSchedule' && 'Consultez votre planning hebdomadaire'}
                {activeNav === 'manageCourses' && 'Gérez vos cours et matières'}
                {activeNav === 'gradeStudents' && 'Saisissez les notes et évaluations'}
                {activeNav === 'absences' && 'Consultez les absences de vos étudiants'}
                {activeNav === 'statistics' && 'Analysez vos performances pédagogiques'}
                {activeNav === 'messaging' && 'Gérez vos messages et communications'}
                {activeNav === 'resources' && 'Accédez aux ressources pédagogiques'}
                {activeNav === 'profile' && 'Gérez vos informations personnelles'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-8">
          {activeNav === 'absences' ? (
            renderAbsences()
          ) : activeNav === 'profile' ? (
            renderProfile()
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardData?.stats.map((stat, index) => {
                  const percentage = Math.min(95, parseInt(stat.value) * 2 || 75);
                  
                  // Icônes professionnelles selon le type de stat
                  const getIcon = () => {
                    switch(stat.label) {
                      case "Mes cours":
                        return <BookOpen className="text-white" size={24} />;
                      case "Étudiants":
                        return <Users className="text-white" size={24} />;
                      case "Évaluations":
                        return <GraduationCap className="text-white" size={24} />;
                      case "Réussite":
                        return <BarChart3 className="text-white" size={24} />;
                      default:
                        return <LayoutDashboard className="text-white" size={24} />;
                    }
                  };
                  
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group"
                    >
                      {/* Header avec icône professionnelle */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStatColorClasses(stat.color)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          {getIcon()}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          +12%
                        </div>
                      </div>

                      {/* Valeur principale */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500">{stat.description}</div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progression</span>
                          <span className="font-semibold">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getStatColorClasses(stat.color)} transition-all duration-1000 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Mini graphique sparkline */}
                      <div className="flex items-end justify-between h-8 gap-1">
                        {[65, 70, 68, 75, 80, 78, 85, 90, 88, percentage].map((height, i) => (
                          <div 
                            key={i}
                            className={`flex-1 bg-gradient-to-t ${getStatColorClasses(stat.color)} rounded-t opacity-30 hover:opacity-60 transition-all`}
                            style={{ height: `${(height / 100) * 32}px` }}
                          ></div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatColorClasses(stat.color)}`}></div>
                          Actif
                        </span>
                        <span>Mis à jour</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal Signaler Absence */}
      {showAbsenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Signaler une absence</h3>
              <button
                onClick={() => setShowAbsenceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                {loadingMatieres ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Chargement des matières...
                  </div>
                ) : (
                  <select
                    value={absenceData.matiereNom}
                    onChange={(e) => setAbsenceData({...absenceData, matiereNom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une matière</option>
                    {matieres.map((matiere) => (
                      <option key={matiere.id} value={matiere.nom}>
                        {matiere.nom}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de l'absence *
                </label>
                <input
                  type="date"
                  value={absenceData.date}
                  onChange={(e) => setAbsenceData({...absenceData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de l'absence *
                </label>
                <textarea
                  value={absenceData.motif}
                  onChange={(e) => setAbsenceData({...absenceData, motif: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Expliquez brièvement le motif de votre absence..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAbsenceModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSignalAbsence}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Signaler l'absence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;