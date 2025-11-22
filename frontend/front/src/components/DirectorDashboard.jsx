import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./DirectorDashboard.css";

const DirectorDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [profileData, setProfileData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    departement: user?.departement || "",
    specialite: user?.specialite || "",
  });

  useEffect(() => {
    console.log('🚀 DirectorDashboard useEffect déclenché');
    console.log('👤 Utilisateur:', user);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log('🔄 Chargement des données du dashboard directeur...');
    console.log('⏰ Début du timeout de 300ms');
    
    // Simulate API call for dashboard data
    setTimeout(() => {
      console.log('⏰ Timeout terminé, création des données...');
      const data = {
        title: "Espace Directeur de Département",
        stats: [
          { label: "Enseignants", value: "24", icon: "👨‍🏫", color: "primary" },
          { label: "Étudiants", value: "450", icon: "👥", color: "turquoise" },
          { label: "Cours actifs", value: "18", icon: "📚", color: "yellow" },
          { label: "Taux de réussite", value: "82%", icon: "📊", color: "primary" },
        ],
        actions: [
          { label: "📅 Mon Emploi du Temps", description: "Consulter mon emploi du temps personnel", action: "mySchedule" },
          { label: "📋 Créer emploi du temps", description: "Créer un nouvel emploi du temps avec drag & drop", action: "createSchedule" },
          { label: "📅 Voir emplois existants", description: "Consulter et gérer les emplois existants", action: "viewSchedules" },
          { label: "👥 Gérer utilisateurs", description: "Administration des comptes utilisateurs", action: "manageUsers" },
          { label: "👨‍🏫 Gérer enseignants", description: "Gestion du personnel enseignant", action: "manageTeachers" },
          { label: "👨‍🎓 Gérer étudiants", description: "Gestion des étudiants du département", action: "manageStudents" },
          { label: "💬 Messagerie", description: "Messagerie interne avec enseignants et étudiants", action: "messaging" },
          { label: "📊 Rapports", description: "Générer des rapports département", action: "reports" },
          { label: "💰 Budget", description: "Suivi budgétaire du département", action: "budget" },
          { label: "📝 Évaluations", description: "Gestion des évaluations", action: "evaluations" },
        ],
      };
      console.log('✅ Données chargées:', data);
      setDashboardData(data);
      setLoading(false);
    }, 300);
  };

  const handleAction = (action) => {
    setActiveNav(action);
    switch (action) {
      case "dashboard":
        // Stay on dashboard
        break;
      case "mySchedule":
        navigate("/my-schedule");
        break;
      case "createSchedule":
        navigate("/schedule-builder");
        break;
      case "viewSchedules":
        navigate("/schedule-viewer");
        break;
      case "teacherSchedules":
        navigate("/teacher-schedules");
        break;
      case "roomSchedules":
        navigate("/room-schedules");
        break;
      case "manageUsers":
        navigate("/admin");
        break;
      case "manageTeachers":
        alert("Ouverture de la gestion des enseignants...");
        break;
      case "manageStudents":
        alert("Ouverture de la gestion des étudiants...");
        break;
      case "messaging":
        navigate('/messagerie');
        break;
      case "reports":
        alert("Ouverture des rapports...");
        break;
      case "budget":
        alert("Ouverture de la gestion budgétaire...");
        break;
      case "evaluations":
        alert("Ouverture des évaluations...");
        break;
      default:
        alert(`Action ${action} non implémentée`);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData.prenom || !profileData.nom || !profileData.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await updateUser({
        nom: profileData.nom,
        prenom: profileData.prenom,
        cin: user.cin, // CIN ne peut pas être modifié
      });

      if (response.success) {
        alert("Profil mis à jour avec succès!");
        setEditingProfile(false);
        // Mettre à jour les données du profil avec les nouvelles valeurs
        setProfileData({
          ...profileData,
          prenom: response.user.prenom,
          nom: response.user.nom,
        });
      } else {
        alert(response.message || "Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log('🎨 Rendu DirectorDashboard - loading:', loading, 'dashboardData:', dashboardData);

  if (loading) {
    console.log('⏳ Affichage de l\'écran de chargement');
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de l'espace directeur...</p>
      </div>
    );
  }

  if (!dashboardData) {
    console.log('❌ Aucune donnée de dashboard disponible');
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Erreur de chargement des données...</p>
      </div>
    );
  }

  console.log('✅ Rendu du dashboard avec', dashboardData.actions?.length, 'actions');

  return (
    <div className="director-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">RÉSEAU</div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="sidebar-user-details">
              <h3>{user?.prenom} {user?.nom}</h3>
              <p>Directeur de Département</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Menu Principal</div>
            <div 
              className={`sidebar-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleAction('dashboard')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span className="sidebar-nav-label">Tableau de bord</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'mySchedule' ? 'active' : ''}`}
              onClick={() => handleAction('mySchedule')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="sidebar-nav-label">Mon Emploi du Temps</span>
            </div>
          </div>

          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Gestion</div>
            <div 
              className={`sidebar-nav-item ${activeNav === 'createSchedule' ? 'active' : ''}`}
              onClick={() => handleAction('createSchedule')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="sidebar-nav-label">Créer emploi du temps</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'viewSchedules' ? 'active' : ''}`}
              onClick={() => handleAction('viewSchedules')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="sidebar-nav-label">Voir emplois classes</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'teacherSchedules' ? 'active' : ''}`}
              onClick={() => handleAction('teacherSchedules')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="sidebar-nav-label">Emplois enseignants</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'roomSchedules' ? 'active' : ''}`}
              onClick={() => handleAction('roomSchedules')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span className="sidebar-nav-label">Emplois salles</span>
            </div>
          </div>

          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Gestion</div>
            <div 
              className={`sidebar-nav-item ${activeNav === 'manageTeachers' ? 'active' : ''}`}
              onClick={() => handleAction('manageTeachers')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="sidebar-nav-label">Gérer enseignants</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'manageStudents' ? 'active' : ''}`}
              onClick={() => handleAction('manageStudents')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="sidebar-nav-label">Gérer étudiants</span>
            </div>
          </div>

          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Outils</div>
            <div 
              className={`sidebar-nav-item ${activeNav === 'reports' ? 'active' : ''}`}
              onClick={() => handleAction('reports')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span className="sidebar-nav-label">Rapports</span>
            </div>

            <div 
              className={`sidebar-nav-item ${activeNav === 'evaluations' ? 'active' : ''}`}
              onClick={() => handleAction('evaluations')}
            >
              <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="sidebar-nav-label">Évaluations</span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Tableau de bord</h1>
          <div className="header-actions">
            <button className="header-btn profile-btn" onClick={() => setShowProfile(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profil
            </button>
          </div>
        </header>

        <main className="main-body">
          {/* Stats Grid */}
          <div className="stats-grid">
            {dashboardData?.stats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-header">
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-body">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Actions rapides</h2>
            <div className="actions-grid">
              {dashboardData?.actions.map((action, index) => (
                <div
                  key={index}
                  className="action-card"
                  onClick={() => handleAction(action.action)}
                >
                  <div className="action-label">{action.label}</div>
                  {action.description && (
                    <div className="action-description">{action.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <button
              className="close-profile"
              onClick={() => setShowProfile(false)}
            >
              ×
            </button>
            <h3>Informations du profil</h3>
            {editingProfile ? (
              <form className="profile-edit" onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
                <div className="form-group">
                  <label>Prénom <span className="required">*</span></label>
                  <input
                    type="text"
                    value={profileData.prenom}
                    onChange={(e) =>
                      setProfileData({ ...profileData, prenom: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom <span className="required">*</span></label>
                  <input
                    type="text"
                    value={profileData.nom}
                    onChange={(e) =>
                      setProfileData({ ...profileData, nom: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    title="L'email ne peut pas être modifié"
                  />
                </div>
                <div className="profile-actions">
                  <button type="submit" className="btn-primary">Sauvegarder</button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingProfile(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
                <div className="profile-item">
                  <span className="profile-label">Prénom:</span>
                  <span className="profile-value">{user?.prenom}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Nom:</span>
                  <span className="profile-value">{user?.nom}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{user?.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Département:</span>
                  <span className="profile-value">{user?.departement?.nom || "Non spécifié"}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Rôle:</span>
                  <span className="profile-value">
                    <span className="badge-role">Directeur de Département</span>
                  </span>
                </div>
                <button className="btn-primary" onClick={() => setEditingProfile(true)}>
                  Modifier le profil
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorDashboard;
