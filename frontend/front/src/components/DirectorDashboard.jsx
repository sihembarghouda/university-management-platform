import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

const DirectorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
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
          { label: "Enseignants", value: "24", icon: "👨‍🏫" },
          { label: "Étudiants", value: "450", icon: "👥" },
          { label: "Cours actifs", value: "18", icon: "📚" },
          { label: "Taux de réussite", value: "82%", icon: "📊" },
        ],
        actions: [
          { label: "📋 Créer emploi du temps", description: "Créer un nouvel emploi du temps avec drag & drop", action: "createSchedule" },
          { label: "📅 Voir emplois existants", description: "Consulter et gérer les emplois existants", action: "viewSchedules" },
          { label: "👥 Gérer utilisateurs", description: "Administration des comptes utilisateurs", action: "manageUsers" },
          { label: "👨‍🏫 Gérer enseignants", description: "Gestion du personnel enseignant", action: "manageTeachers" },
          { label: "👨‍🎓 Gérer étudiants", description: "Gestion des étudiants du département", action: "manageStudents" },
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
    switch (action) {
      case "createSchedule":
        navigate("/schedule-builder");
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
      case "viewSchedules":
        navigate("/schedule-viewer");
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
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Profil mis à jour avec succès!");
      setEditingProfile(false);
    } catch (error) {
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-info">
              <h1>{dashboardData?.title}</h1>
              <div className="user-info">
                <span className="user-name">
                  {user?.prenom} {user?.nom}
                </span>
                <span className="user-role">Directeur de Département</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤 Profil
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <h3>Informations du profil</h3>
            {editingProfile ? (
              <div className="profile-edit">
                <div className="form-group">
                  <label>Prénom:</label>
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
                  <label>Nom:</label>
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
                  <label>Email:</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone:</label>
                  <input
                    type="tel"
                    value={profileData.telephone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        telephone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Département:</label>
                  <input
                    type="text"
                    value={profileData.departement}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        departement: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Spécialité:</label>
                  <input
                    type="text"
                    value={profileData.specialite}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        specialite: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="profile-actions">
                  <button onClick={handleProfileUpdate}>Sauvegarder</button>
                  <button onClick={() => setEditingProfile(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <p>
                  <strong>Prénom:</strong> {user?.prenom}
                </p>
                <p>
                  <strong>Nom:</strong> {user?.nom}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Téléphone:</strong>{" "}
                  {user?.telephone || "Non spécifié"}
                </p>
                <p>
                  <strong>Département:</strong>{" "}
                  {user?.departement || "Non spécifié"}
                </p>
                <p>
                  <strong>Spécialité:</strong>{" "}
                  {user?.specialite || "Non spécifiée"}
                </p>
                <p>
                  <strong>Rôle:</strong> Directeur de Département
                </p>
                <button onClick={() => setEditingProfile(true)}>
                  Modifier
                </button>
              </div>
            )}
            <button
              className="close-profile"
              onClick={() => setShowProfile(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="stats-grid">
          {dashboardData?.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="actions-section">
          <h2>Actions disponibles</h2>
          <div className="actions-grid">
            {dashboardData?.actions.map((action, index) => (
              <button
                key={index}
                className="action-btn"
                onClick={() => handleAction(action.action)}
              >
                <span className="action-label">{action.label}</span>
                {action.description && (
                  <span className="action-description">{action.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
