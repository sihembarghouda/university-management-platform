import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, BookOpen, BarChart3, Mail, Library, FileText, X, Award, Clock, TrendingUp } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  const [user] = useState({
    prenom: "Mohammed",
    nom: "Ben Ali",
    email: "mohammed.benali@enis.tn",
    telephone: "+216 98 765 432",
    departement: "Génie Informatique"
  });

  const [currentPage] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    departement: user?.departement || "",
  });

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
      description: "Messages et notifications",
      icon: Mail,
      path: "/messagerie",
      badge: "3"
    },
    { 
      label: "Bibliothèque", 
      action: "library",
      description: "Ressources pédagogiques",
      icon: Library,
      path: "/bibliotheque"
    },
    { 
      label: "Scolarité", 
      action: "scolarite",
      description: "Documents administratifs",
      icon: FileText,
      path: "/scolarite"
    },
  ];

  const handleServiceClick = (service) => {
    // Navigation vers la vraie page avec React Router
    navigate(service.path);
  };

  const handleProfileUpdate = () => {
    if (!profileData.prenom || !profileData.nom || !profileData.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    alert("Profil mis à jour avec succès!");
    setEditingProfile(false);
  };

  // Composant pour afficher le contenu selon la page
  const PageContent = () => {
    const stats = [
      { 
        label: "Mes cours", 
        value: "6", 
        color: "primary",
        description: "Cours actifs",
        icon: BookOpen,
        trend: "+2 ce semestre"
      },
      { 
        label: "Absences", 
        value: "2", 
        color: "yellow",
        description: "Jours d'absence",
        icon: Clock,
        trend: "Bon suivi"
      },
      { 
        label: "Crédits validés", 
        value: "45/180", 
        color: "primary",
        description: "Progression",
        icon: Award,
        trend: "25% complété"
      },
    ];

    switch(currentPage) {
      case "dashboard":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Vue d'ensemble
                </h2>
                <div className="text-sm text-gray-500">Dernière mise à jour: maintenant</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`group bg-white rounded-2xl shadow-md hover:shadow-xl border-l-4 p-6 transition-all duration-300 hover:transform hover:-translate-y-1 ${
                        stat.color === 'primary' ? 'border-blue-600' : 'border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          stat.color === 'primary' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            stat.color === 'primary' ? 'text-blue-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          stat.color === 'primary' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {stat.trend}
                        </span>
                      </div>
                      
                      <div className="text-sm font-semibold text-gray-500 mb-2">{stat.label}</div>
                      <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          stat.color === 'primary' ? 'bg-blue-600' : 'bg-yellow-500'
                        }`}></div>
                        {stat.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "viewSchedule":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Mon Emploi du Temps
                </h2>
                <p className="text-gray-600">Semaine du 18 au 24 Novembre 2024</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-6 gap-4">
                  <div className="font-semibold text-gray-700">Horaire</div>
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(day => (
                    <div key={day} className="font-semibold text-center text-gray-700">{day}</div>
                  ))}
                  
                  {['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'].map((time, idx) => (
                    <React.Fragment key={time}>
                      <div className="text-sm text-gray-600 py-4">{time}</div>
                      {[1, 2, 3, 4, 5].map(day => (
                        <div key={day} className={`p-3 rounded-lg ${
                          (idx + day) % 3 === 0 
                            ? 'bg-blue-100 border-l-4 border-blue-600' 
                            : (idx + day) % 2 === 0
                            ? 'bg-indigo-100 border-l-4 border-indigo-600'
                            : 'bg-gray-50'
                        }`}>
                          {(idx + day) % 3 === 0 && (
                            <div>
                              <div className="font-semibold text-sm text-gray-800">Mathématiques</div>
                              <div className="text-xs text-gray-600">Salle A101</div>
                            </div>
                          )}
                          {(idx + day) % 2 === 0 && (idx + day) % 3 !== 0 && (
                            <div>
                              <div className="font-semibold text-sm text-gray-800">Programmation</div>
                              <div className="text-xs text-gray-600">Lab B205</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "viewGrades":
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Mes Notes
              </h2>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Matière</th>
                      <th className="px-6 py-4 text-center">Note</th>
                      <th className="px-6 py-4 text-center">Coefficient</th>
                      <th className="px-6 py-4 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { matiere: 'Mathématiques', note: 15.5, coef: 3, status: 'Validé' },
                      { matiere: 'Programmation', note: 17, coef: 4, status: 'Validé' },
                      { matiere: 'Base de données', note: 13, coef: 3, status: 'Validé' },
                      { matiere: 'Réseaux', note: 14.5, coef: 2, status: 'Validé' },
                      { matiere: 'Architecture', note: 16, coef: 3, status: 'Validé' },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{item.matiere}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {item.note}/20
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">{item.coef}</td>
                        <td className="px-6 py-4 text-center">
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
        );

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
      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={() => setShowProfile(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full m-4 transform transition-all animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Mon Profil</h3>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.prenom}
                      onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.nom}
                      onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={profileData.telephone}
                      onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Département</label>
                    <input
                      type="text"
                      value={profileData.departement}
                      onChange={(e) => setProfileData({ ...profileData, departement: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Votre département"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleProfileUpdate}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Prénom:</span>
                    <span className="text-sm font-medium text-gray-800">{user?.prenom}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Nom:</span>
                    <span className="text-sm font-medium text-gray-800">{user?.nom}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Email:</span>
                    <span className="text-sm font-medium text-gray-800">{user?.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Téléphone:</span>
                    <span className="text-sm font-medium text-gray-800">{user?.telephone || "Non spécifié"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Département:</span>
                    <span className="text-sm font-medium text-gray-800">{user?.departement || "Non spécifié"}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-sm font-semibold text-gray-500">Rôle:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold rounded-full">
                      Étudiant
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Modifier le profil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content - DashboardLayout fournit déjà la sidebar */}
      <main className="p-6">
        <PageContent />
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;