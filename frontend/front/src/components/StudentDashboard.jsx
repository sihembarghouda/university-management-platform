import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Calendar, BookOpen, BarChart3, Mail, Library, FileText, Award, Clock, TrendingUp, Bell, UserX } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import NotificationsPage from './NotificationsPage';

const StudentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(() => {
    // Détecter la page depuis l'URL
    if (location.pathname === '/absences') return 'absences';
    return 'dashboard';
  });
  const [studentAbsences, setStudentAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [absenceHistory, setAbsenceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [studentEliminations, setStudentEliminations] = useState([]);
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [showAbsenceRequestModal, setShowAbsenceRequestModal] = useState(false);

  useEffect(() => {
    // Component mounted
  }, []);

  const loadStudentAbsences = async () => {
    console.log('🔄 loadStudentAbsences appelée pour étudiant:', user?.id);
    setLoadingAbsences(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token présent:', !!token);
      const response = await fetch(`http://localhost:3003/api/attendance/student/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Réponse API - Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données reçues:', data.absences.length, 'absences,', data.eliminations.length, 'éliminations');
        setStudentAbsences(data.absences || []);
        setStudentEliminations(data.eliminations || []);
      } else {
        console.error('❌ Erreur API - Status:', response.status);
        const errorText = await response.text();
        console.error('Détails erreur:', errorText);
        setStudentAbsences([]);
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      setStudentAbsences([]);
    } finally {
      setLoadingAbsences(false);
    }
  };

  const loadAbsenceHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/attendance/student/${user?.id}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAbsenceHistory(data);
      } else {
        console.error('Erreur lors du chargement de l\'historique');
        setAbsenceHistory([]);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setAbsenceHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openJustificationModal = (absence) => {
    setSelectedAbsence(absence);
    setShowJustificationModal(true);
  };

  const submitJustificationRequest = async (justificationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/absences/${selectedAbsence.id}/justifier`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(justificationData),
      });

      if (response.ok) {
        alert('Demande de justification soumise avec succès !');
        setShowJustificationModal(false);
        setSelectedAbsence(null);
        loadStudentAbsences(); // Recharger les absences
      } else {
        const error = await response.text();
        alert('Erreur lors de la soumission: ' + error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur réseau lors de la soumission');
    }
  };

  const submitAbsenceRequest = async (requestData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/absences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sujet: 'etudiant',
          matiereId: parseInt(requestData.matiereId),
          dateAbsence: requestData.dateAbsence,
          heureDebut: requestData.heureDebut,
          heureFin: requestData.heureFin,
          motifJustification: requestData.motif,
          typeJustificatif: requestData.typeJustificatif,
          pieceJustificative: requestData.pieceJustificative,
          statut: 'en_attente'
        }),
      });

      if (response.ok) {
        alert('Demande d\'absence soumise avec succès ! Elle sera examinée par votre enseignant.');
        setShowAbsenceRequestModal(false);
        loadStudentAbsences(); // Recharger les absences
      } else {
        const error = await response.text();
        alert('Erreur lors de la soumission: ' + error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur réseau lors de la soumission');
    }
  };

  // Charger automatiquement les données quand on ouvre la page des absences
  useEffect(() => {
    console.log('🔄 useEffect triggered - currentPage:', currentPage, 'user.id:', user?.id);
    if (currentPage === "absences" && user?.id) {
      console.log('📥 Chargement automatique des absences pour étudiant:', user.id);
      loadStudentAbsences();
      loadAbsenceHistory();
    }
  }, [currentPage, user?.id]);

  const services = [
    {
      label: "Tableau de bord",
      action: "dashboard",
      description: "Vue d'ensemble",
      icon: TrendingUp,
      path: "/dashboard"
    },
    {
      label: "Mon emploi du temps",
      action: "viewSchedule",
      description: "Consulter mon planning",
      icon: Calendar,
      path: "/my-schedule"
    },
    {
      label: "Mes notes",
      action: "viewGrades",
      description: "Résultats et bulletins",
      icon: BookOpen,
      path: "/notes"
    },
    {
      label: "Statistiques",
      action: "statistics",
      description: "Analyse de performance",
      icon: BarChart3,
      path: "/statistiques"
    },
    {
      label: "Messagerie",
      action: "messaging",
      description: "Communications",
      icon: Mail,
      path: "/messages"
    },
    {
      label: "Notifications",
      action: "notifications",
      description: "Alertes et messages",
      icon: Bell,
      path: "/notifications"
    },
    {
      label: "Suivi des absences",
      action: "absences",
      description: "Consulter mes absences",
      icon: UserX,
      path: "/absences"
    },
    {
      label: "Ressources",
      action: "resources",
      description: "Documents et supports",
      icon: Library,
      path: "/resources"
    }
  ];

  const getStatColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    };
    return colors[color] || colors.blue;
  };

  // Composant pour afficher le contenu selon la page
  const PageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="pt-3 pb-6">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Moyenne générale",
                    value: "14.5",
                    description: "Sur 20",
                    color: "green",
                    icon: TrendingUp
                  },
                  {
                    label: "Crédits validés",
                    value: "120/180",
                    description: "66% complété",
                    color: "blue",
                    icon: BookOpen
                  },
                  {
                    label: "Absences ce mois",
                    value: "2",
                    description: "Jours d'absence",
                    color: "orange",
                    icon: Clock
                  },
                  {
                    label: "Messages non lus",
                    value: "3",
                    description: "À consulter",
                    color: "purple",
                    icon: Mail
                  }
                ].map((stat, index) => {
                  const percentage = stat.label === "Moyenne générale" ? 72 : 
                                   stat.label === "Crédits validés" ? 66 : 
                                   stat.label === "Absences ce mois" ? 15 : 25;
                  
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all group"
                    >
                      {/* Header avec icône professionnelle */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getStatColorClasses(stat.color)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <stat.icon className="text-white" size={18} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          +{stat.label === "Absences ce mois" ? "5%" : "12%"}
                        </div>
                      </div>

                      {/* Valeur principale */}
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
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
                      <div className="flex items-end justify-between h-6 gap-1">
                        {[65, 70, 68, 75, 80, 78, 85, 90, 88, percentage].map((height, i) => (
                          <div 
                            key={i}
                            className={`flex-1 bg-gradient-to-t ${getStatColorClasses(stat.color)} rounded-t opacity-30 hover:opacity-60 transition-all`}
                            style={{ height: `${(height / 100) * 24}px` }}
                          ></div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
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

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Prochains cours</h3>
                  <div className="space-y-3">
                    {[
                      { subject: "Algorithmique", time: "08:00 - 10:00", room: "Salle A101" },
                      { subject: "Base de données", time: "10:30 - 12:30", room: "Salle B205" },
                      { subject: "Réseaux", time: "14:00 - 16:00", room: "Salle C103" }
                    ].map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{course.subject}</p>
                          <p className="text-sm text-gray-600">{course.time} • {course.room}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dernières notes</h3>
                  <div className="space-y-3">
                    {[
                      { subject: "Mathématiques", grade: "15.5/20", date: "15 Déc" },
                      { subject: "Physique", grade: "14.0/20", date: "12 Déc" },
                      { subject: "Informatique", grade: "16.5/20", date: "10 Déc" }
                    ].map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{grade.subject}</p>
                          <p className="text-sm text-gray-600">{grade.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{grade.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "viewSchedule":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon emploi du temps</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">L'emploi du temps sera bientôt disponible.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "viewGrades":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes notes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Matière</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Note</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Coefficient</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { subject: "Algorithmique", grade: "15.5", coeff: "3", date: "15/12/2024", status: "Validé" },
                        { subject: "Base de données", grade: "14.0", coeff: "2", date: "12/12/2024", status: "Validé" },
                        { subject: "Réseaux", grade: "16.5", coeff: "3", date: "10/12/2024", status: "Validé" },
                        { subject: "Mathématiques", grade: "13.5", coeff: "4", date: "08/12/2024", status: "En attente" }
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-800">{item.subject}</td>
                          <td className="py-3 px-4 text-gray-800 font-medium">{item.grade}/20</td>
                          <td className="py-3 px-4 text-gray-800">{item.coeff}</td>
                          <td className="py-3 px-4 text-gray-600">{item.date}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "absences":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mes absences</h2>
                    <p className="text-gray-600 mt-1">Consultez vos absences et leur historique</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAbsenceRequestModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <UserX size={18} />
                      Demander une absence
                    </button>
                  </div>
                </div>

                {/* Section Historique */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique des modifications</h3>
                  {loadingHistory ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Chargement de l'historique...</p>
                      </div>
                    </div>
                  ) : absenceHistory.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Aucun historique</h4>
                      <p className="text-gray-600 text-sm">Aucune modification d'absence n'a encore été enregistrée.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {absenceHistory.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              entry.action === 'deleted' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <span className={`text-sm font-medium ${
                                entry.action === 'deleted' ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {entry.action === 'deleted' ? '✓' : '+'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {entry.action === 'deleted' ? 'Absence supprimée' : 'Absence ajoutée'}
                                {entry.matiere_nom && entry.matiere_nom !== 'Matière inconnue' && ` - ${entry.matiere_nom}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {entry.absence_count_before} → {entry.absence_count_after} absences
                                {entry.enseignant_prenom && entry.enseignant_nom &&
                                  ` • Par ${entry.enseignant_prenom} ${entry.enseignant_nom}`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              {new Date(entry.date_action).toLocaleDateString('fr-FR')}
                            </span>
                            <p className="text-xs text-gray-400">
                              {new Date(entry.date_action).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Absences actuelles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Absences actuelles</h3>
                  {loadingAbsences ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des absences...</p>
                      </div>
                    </div>
                  ) : studentAbsences.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune absence</h3>
                      <p className="text-gray-600">Vous n'avez enregistré aucune absence cette année.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Regrouper les absences par matière */}
                      {Object.entries(
                        studentAbsences.reduce((acc, absence) => {
                          const matiere = absence.matiere_nom;
                          if (!acc[matiere]) acc[matiere] = [];
                          acc[matiere].push(absence);
                          return acc;
                        }, {})
                      ).map(([matiere, absences]) => (
                        <div key={matiere} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{matiere}</h3>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                              {absences.length} absence{absences.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {absences.map((absence, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 text-sm font-medium">A</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {new Date(absence.date).toLocaleDateString('fr-FR')}
                                    </p>
                                    <p className="text-sm text-gray-600">{absence.horaire}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                    Absent
                                  </span>
                                  {absence.statut === 'non_justifiee' && (
                                    <button
                                      onClick={() => openJustificationModal(absence)}
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                    >
                                      Justifier
                                    </button>
                                  )}
                                  {absence.statut === 'en_attente' && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                      En attente
                                    </span>
                                  )}
                                  {absence.statut === 'justifiee' && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                      Justifiée
                                    </span>
                                  )}
                                  {absence.statut === 'refusee' && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                      Refusée
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Éliminations */}
                {studentEliminations.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      Éliminations
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">⚠</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800">Attention - Élimination détectée</h4>
                          <p className="text-red-600 text-sm">Vous avez dépassé le seuil d'absences autorisé dans les matières suivantes :</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {studentEliminations.map((elimination, index) => (
                          <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-800">{elimination.matiere_nom}</h5>
                                <p className="text-sm text-gray-600">
                                  {elimination.nombre_absences} absence{elimination.nombre_absences > 1 ? 's' : ''} 
                                  (seuil : {elimination.seuil_elimination} absences pour matières {elimination.frequence_hebdomadaire === 1 ? 'hebdomadaires' : 'bihebdomadaires ou plus'})
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                  Éliminé
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <strong>Important :</strong> L'élimination peut entraîner des conséquences académiques. 
                          Contactez votre enseignant ou le directeur pour discuter des solutions possibles.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return <NotificationsPage />;

      default:
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="mb-4">
                  <div className="inline-block p-4 bg-blue-100 rounded-full">
                    {services.find(s => s.action === currentPage)?.icon &&
                      React.createElement(services.find(s => s.action === currentPage).icon, {
                        className: "w-12 h-12 text-blue-600"
                      })
                    }
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {services.find(s => s.action === currentPage)?.label}
                </h2>
                <p className="text-gray-600 mb-6">
                  {services.find(s => s.action === currentPage)?.description}
                </p>
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                  Cette section sera bientôt disponible
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-y-auto">
      {/* Page Content - DashboardLayout fournit déjà la sidebar */}
      <main className="p-6">
        <PageContent />
      </main>

      {/* Modal de justification */}
      <JustificationModal
        isOpen={showJustificationModal}
        onClose={() => setShowJustificationModal(false)}
        absence={selectedAbsence}
        onSubmit={submitJustificationRequest}
      />

      {/* Modal de demande d'absence */}
      <AbsenceRequestModal
        isOpen={showAbsenceRequestModal}
        onClose={() => setShowAbsenceRequestModal(false)}
        onSubmit={submitAbsenceRequest}
      />
    </div>
  );
};

const JustificationModal = ({ isOpen, onClose, absence, onSubmit }) => {
  const [formData, setFormData] = useState({
    typeJustificatif: '',
    motifJustification: '',
    pieceJustificative: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.typeJustificatif || !formData.motifJustification.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Demander justification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {absence && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Absence du {new Date(absence.date).toLocaleDateString('fr-FR')} - {absence.horaire}
            </p>
            <p className="text-sm font-medium text-gray-800">{absence.matiere_nom}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de justification *
            </label>
            <select
              name="typeJustificatif"
              value={formData.typeJustificatif}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="maladie">Maladie</option>
              <option value="personnel">Raison personnelle</option>
              <option value="administratif">Raison administrative</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif détaillé *
            </label>
            <textarea
              name="motifJustification"
              value={formData.motifJustification}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expliquez la raison de votre absence..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièce justificative (optionnel)
            </label>
            <input
              type="text"
              name="pieceJustificative"
              value={formData.pieceJustificative}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lien vers document ou numéro de référence"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AbsenceRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    matiereId: '',
    dateAbsence: '',
    heureDebut: '',
    heureFin: '',
    typeJustificatif: '',
    motif: '',
    pieceJustificative: ''
  });
  const [matieres, setMatieres] = useState([]);
  const [loadingMatieres, setLoadingMatieres] = useState(false);

  // Charger les matières disponibles
  useEffect(() => {
    if (isOpen) {
      loadMatieres();
    }
  }, [isOpen]);

  const loadMatieres = async () => {
    setLoadingMatieres(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/matiere', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatieres(data);
      }
    } catch (error) {
      console.error('Erreur chargement matières:', error);
    } finally {
      setLoadingMatieres(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.matiereId || !formData.dateAbsence || !formData.typeJustificatif || !formData.motif.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de la date (pas dans le passé)
    const selectedDate = new Date(formData.dateAbsence);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Vous ne pouvez pas demander une absence pour une date passée');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Demander une absence</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>ℹ️ Information :</strong> Cette demande sera envoyée à votre enseignant pour approbation.
            L'absence ne sera justifiée que si elle est approuvée avant le cours.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière *
              </label>
              {loadingMatieres ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <select
                  name="matiereId"
                  value={formData.matiereId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {matieres.map((matiere) => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'absence *
              </label>
              <input
                type="date"
                name="dateAbsence"
                value={formData.dateAbsence}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de début
              </label>
              <input
                type="time"
                name="heureDebut"
                value={formData.heureDebut}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de fin
              </label>
              <input
                type="time"
                name="heureFin"
                value={formData.heureFin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de justification *
            </label>
            <select
              name="typeJustificatif"
              value={formData.typeJustificatif}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="maladie">Maladie</option>
              <option value="personnel">Raison personnelle</option>
              <option value="administratif">Raison administrative</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif détaillé *
            </label>
            <textarea
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expliquez la raison de votre absence..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièce justificative (optionnel)
            </label>
            <input
              type="text"
              name="pieceJustificative"
              value={formData.pieceJustificative}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lien vers document ou numéro de référence"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Envoyer la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;