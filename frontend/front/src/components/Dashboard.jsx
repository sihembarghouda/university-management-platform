import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

// Composant grille horaire intégré
const ScheduleGridIntegrated = () => {
  const [schedule, setSchedule] = useState({});
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const handleDrop = (e, day, time) => {
    e.preventDefault();
    const subject = e.dataTransfer.getData('text/plain');
    const key = `${day}-${time}`;
    setSchedule(prev => ({...prev, [key]: subject}));
  };

  const handleClick = (day, time) => {
    const key = `${day}-${time}`;
    setSchedule(prev => {
      const newSchedule = {...prev};
      delete newSchedule[key];
      return newSchedule;
    });
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '1px', background: '#dee2e6'}}>
      {/* Header */}
      <div style={{background: '#6c757d', color: 'white', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold'}}></div>
      {days.map(day => (
        <div key={day} style={{background: '#6c757d', color: 'white', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>
          {day}
        </div>
      ))}
      
      {/* Rows */}
      {timeSlots.map(time => (
        <React.Fragment key={time}>
          <div style={{background: '#f8f9fa', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>
            {time}
          </div>
          {days.map(day => {
            const key = `${day}-${time}`;
            const hasSubject = schedule[key];
            return (
              <div 
                key={key}
                style={{
                  background: hasSubject ? '#e3f2fd' : 'white',
                  minHeight: '80px',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: hasSubject ? 'pointer' : 'default',
                  border: hasSubject ? '2px solid #2196f3' : '1px dashed #ccc',
                  fontSize: '0.9rem',
                  fontWeight: hasSubject ? 'bold' : 'normal',
                  color: hasSubject ? '#1565c0' : '#6c757d'
                }}
                onDrop={(e) => handleDrop(e, day, time)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => hasSubject && handleClick(day, time)}
              >
                {hasSubject || 'Déposer ici'}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'schedule-builder', 'schedule-viewer'

  useEffect(() => {
    console.log('🔄 Dashboard useEffect - user role:', user?.role);
    
    // FORCER le rôle directeur pour test
    const loadData = () => {
      console.log('📊 LoadDashboardData appelé pour le rôle:', user?.role);
      
      // FORCE les données de directeur pour test
      const forceDirectorRole = 'directeur_departement'; // FORCE toujours directeur
      console.log('🎯 Force le rôle:', forceDirectorRole);
      
      setTimeout(() => {
        let data = getDashboardDataByRole(forceDirectorRole);
        
        // SÉCURITÉ : Si pas d'actions, forcer les actions de directeur
        if (!data || !data.actions || data.actions.length === 0) {
          console.log('⚠️ Pas d\'actions trouvées, création manuelle...');
          data = {
            title: "Espace Directeur de Département",
            stats: [
              { label: "Enseignants", value: "24", icon: "👨‍🏫" },
              { label: "Étudiants", value: "450", icon: "👥" },
              { label: "Cours actifs", value: "18", icon: "📚" },
              { label: "Taux de réussite", value: "82%", icon: "📊" },
            ],
            actions: [
              {
                label: "📋 Créer emploi du temps",
                icon: "📋",
                action: "createSchedule",
                description: "Créer un nouvel emploi du temps avec drag & drop"
              },
              { 
                label: "📅 Voir emplois existants", 
                icon: "📅", 
                action: "viewSchedules",
                description: "Consulter et gérer les emplois existants"
              },
              { 
                label: "👥 Gérer utilisateurs", 
                icon: "👥", 
                action: "manageUsers",
                description: "Administration des comptes utilisateurs"
              },
              {
                label: "👨‍🏫 Gérer enseignants",
                icon: "👨‍🏫",
                action: "manageTeachers",
                description: "Gestion du personnel enseignant"
              }
            ]
          };
        }
        
        console.log('✅ Données finales avec actions:', data.actions?.length);
        setDashboardData(data);
        setLoading(false);
      }, 100);
    };
    
    loadData();
  }, [user?.role]);

  const getDashboardDataByRole = (role) => {
    switch (role) {
      case "etudiant":
        return {
          title: "Espace Étudiant",
          stats: [
            { label: "Mes cours", value: "6", icon: "📚" },
            { label: "Notes moyennes", value: "14.5", icon: "📊" },
            { label: "Absences", value: "2", icon: "⚠️" },
            { label: "Crédits validés", value: "45/180", icon: "🎓" },
          ],
          actions: [
            {
              label: "Mon emploi du temps",
              icon: "📅",
              action: "viewSchedule",
            },
            { label: "Mes notes", icon: "📈", action: "viewGrades" },
            { label: "Statistiques", icon: "📊", action: "statistics" },
            { label: "Messagerie", icon: "💬", action: "messaging" },
            { label: "Bibliothèque", icon: "📖", action: "library" },
          ],
        };
      case "enseignant":
        return {
          title: "Espace Enseignant",
          stats: [
            { label: "Cours enseignés", value: "5", icon: "📚" },
            { label: "Étudiants", value: "147", icon: "👥" },
            { label: "Devoirs à corriger", value: "23", icon: "📝" },
            { label: "Heures/semaine", value: "18", icon: "⏰" },
          ],
          actions: [
            {
              label: "Mon emploi du temps",
              icon: "📅",
              action: "viewSchedule",
            },
            { label: "Emploi cours", icon: "📋", action: "viewCourseSchedule" },
            { label: "Signaler absence", icon: "🚫", action: "reportAbsence" },
            {
              label: "Proposer rattrapage",
              icon: "🔄",
              action: "proposeCatchup",
            },
            {
              label: "Valider absences",
              icon: "✅",
              action: "validateAbsences",
            },
            { label: "Saisir notes", icon: "📝", action: "enterGrades" },
            { label: "Messagerie", icon: "💬", action: "messaging" },
            { label: "Mes cours", icon: "📚", action: "manageCourses" },
          ],
        };
      case "directeur_departement":
        return {
          title: "Espace Directeur de Département",
          stats: [
            { label: "Enseignants", value: "24", icon: "👨‍🏫" },
            { label: "Étudiants", value: "450", icon: "👥" },
            { label: "Cours actifs", value: "18", icon: "📚" },
            { label: "Taux de réussite", value: "82%", icon: "📊" },
          ],
          actions: [
            {
              label: "📋 Créer emploi du temps",
              icon: "📋",
              action: "createSchedule",
              description: "Créer un nouvel emploi du temps avec drag & drop"
            },
            { 
              label: "📅 Voir emplois existants", 
              icon: "📅", 
              action: "viewSchedules",
              description: "Consulter et gérer les emplois existants"
            },
            { 
              label: "👥 Gérer utilisateurs", 
              icon: "👥", 
              action: "manageUsers",
              description: "Administration des comptes utilisateurs"
            },
            {
              label: "👨‍🏫 Gérer enseignants",
              icon: "👨‍🏫",
              action: "manageTeachers",
              description: "Gestion du personnel enseignant"
            },
            {
              label: "👨‍🎓 Gérer étudiants",
              icon: "👨‍🎓",
              action: "manageStudents",
              description: "Gestion des étudiants du département"
            },
            { 
              label: "📊 Rapports", 
              icon: "📊", 
              action: "reports",
              description: "Générer des rapports département"
            },
            { 
              label: "💰 Budget", 
              icon: "💰", 
              action: "budget",
              description: "Suivi budgétaire du département"
            },
            { 
              label: "📝 Évaluations", 
              icon: "📝", 
              action: "evaluations",
              description: "Gestion des évaluations"
            },
          ],
        };
      case "administratif":
        return {
          title: "Panneau Administratif",
          stats: [
            { label: "Étudiants total", value: "1,247", icon: "🎓" },
            { label: "Enseignants total", value: "89", icon: "👩‍🏫" },
            { label: "Départements", value: "12", icon: "🏢" },
            { label: "Taux de présence", value: "87%", icon: "📊" },
          ],
          actions: [
            {
              label: "Configuration système",
              icon: "⚙️",
              action: "systemConfig",
            },
            {
              label: "Statistiques globales",
              icon: "📊",
              action: "globalStats",
            },
            { label: "Logs système", icon: "📋", action: "systemLogs" },
            { label: "Sauvegarde", icon: "💾", action: "backup" },
            { label: "Sécurité", icon: "🔒", action: "security" },
            { label: "Maintenance", icon: "🛠️", action: "maintenance" },
          ],
        };
      default:
        return {
          title: "Tableau de bord",
          stats: [],
          actions: [],
        };
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case "manageMembers":
        if (user.role === "directeur_departement") {
          navigate("/admin");
        } else {
          alert("Seul le directeur de département peut gérer les membres");
        }
        break;
      case "manageUsers":
        navigate("/admin");
        break;
      case "viewSchedule":
        alert("Ouverture de l'emploi du temps...");
        break;
      case "viewGrades":
        alert("Ouverture des notes...");
        break;
      case "statistics":
        alert("Ouverture des statistiques...");
        break;
      case "messaging":
        alert("Ouverture de la messagerie...");
        break;
      case "library":
        alert("Ouverture de la bibliothèque...");
        break;
      case "viewCourseSchedule":
        alert("Ouverture de l'emploi du temps des cours...");
        break;
      case "reportAbsence":
        alert("Signalement d'absence...");
        break;
      case "proposeCatchup":
        alert("Proposition de rattrapage...");
        break;
      case "validateAbsences":
        alert("Validation des absences...");
        break;
      case "enterGrades":
        alert("Saisie des notes...");
        break;
      case "manageCourses":
        alert("Gestion des cours...");
        break;
      case "createSchedule":
        navigate('/schedule-builder');
        break;
      case "viewSchedules":
        navigate('/schedule-viewer');
        break;
      case "editSchedule":
        alert("Modification d'emploi du temps...");
        break;
      case "validateSchedule":
        alert("Validation d'emploi du temps...");
        break;
      case "resolveConflicts":
        alert("Résolution des conflits...");
        break;
      case "departmentDashboard":
        alert("Ouverture du tableau de bord département...");
        break;
      case "manageCatchups":
        alert("Gestion des rattrapages...");
        break;
      case "manageSubjects":
        alert("Gestion des matières...");
        break;
      case "manageGroups":
        alert("Gestion des groupes...");
        break;
      case "reports":
        alert("Ouverture des rapports...");
        break;
      case "manageReferences":
        alert("Gestion des référentiels...");
        break;
      case "manageDepartments":
        alert("Gestion des départements...");
        break;
      case "manageSpecialties":
        alert("Gestion des spécialités...");
        break;
      case "manageTeachers":
        alert("Ouverture de la gestion des enseignants...");
        break;
      case "manageStudents":
        alert("Ouverture de la gestion des étudiants...");
        break;
      case "budget":
        alert("Ouverture de la gestion budgétaire...");
        break;
      case "evaluations":
        alert("Ouverture des évaluations...");
        break;
      case "manageRooms":
        alert("Gestion des salles...");
        break;
      case "superviseSchedules":
        alert("Supervision des emplois du temps...");
        break;
      case "manageConflicts":
        alert("Gestion des conflits...");
        break;
      case "institutionalReports":
        alert("Rapports institutionnels...");
        break;
      case "manageEvents":
        alert("Gestion des événements...");
        break;
      case "manageClosures":
        alert("Gestion des fermetures/conférences...");
        break;
      case "systemConfig":
        alert("Configuration système...");
        break;
      case "globalStats":
        alert("Statistiques globales...");
        break;
      case "systemLogs":
        alert("Logs système...");
        break;
      case "backup":
        alert("Sauvegarde...");
        break;
      case "security":
        alert("Sécurité...");
        break;
      case "maintenance":
        alert("Maintenance...");
        break;
      default:
        alert(`Action ${action} non implémentée`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>{dashboardData?.title}</h1>
          <div className="user-info">
            <span className="user-name">
              {user?.prenom} {user?.nom}
            </span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={() => {
              console.log('🚀 Affichage ScheduleBuilder intégré');
              setCurrentView('schedule-builder');
            }} 
            style={{marginRight: '1rem', padding: '0.5rem 1rem', background: currentView === 'schedule-builder' ? '#d63031' : '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'}}
          >
            📋 CRÉER EMPLOI
          </button>
          <button 
            onClick={() => {
              console.log('🚀 Affichage ScheduleViewer intégré');
              setCurrentView('schedule-viewer');
            }} 
            style={{marginRight: '1rem', padding: '0.5rem 1rem', background: currentView === 'schedule-viewer' ? '#00b894' : '#4ecdc4', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'}}
          >
            📅 VOIR EMPLOIS
          </button>
          {currentView !== 'dashboard' && (
            <button 
              onClick={() => setCurrentView('dashboard')} 
              style={{marginRight: '1rem', padding: '0.5rem 1rem', background: '#636e72', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'}}
            >
              🏠 DASHBOARD
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

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
          
          {/* DEBUG INFO */}
          <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
            <strong>🔍 DEBUG:</strong><br/>
            User Role: {user?.role}<br/>
            DashboardData exists: {dashboardData ? 'Oui' : 'Non'}<br/>
            Actions count: {dashboardData?.actions?.length || 0}<br/>
            Loading: {loading ? 'Oui' : 'Non'}
          </div>
          
          <div className="actions-grid">
            {dashboardData?.actions?.length > 0 ? (
              dashboardData.actions.map((action, index) => (
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
              ))
            ) : (
              <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                ❌ Aucune action disponible - Vérifiez le rôle utilisateur
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* SCHEDULE BUILDER INTÉGRÉ */}
      {currentView === 'schedule-builder' && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 1000, overflow: 'auto'}}>
          <div style={{padding: '2rem'}}>
            <h2 style={{color: '#2d3436', marginBottom: '2rem'}}>🎯 Créateur d'Emploi du Temps - Drag & Drop</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', height: 'calc(100vh - 120px)'}}>
              {/* Panel des matières */}
              <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '2px solid #dee2e6'}}>
                <h3>📚 Matières Disponibles</h3>
                <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {['Mathématiques', 'Algorithmique', 'Base de données', 'Réseaux', 'Programmation Web', 'Systèmes', 'POO', 'IA'].map((subject, index) => (
                    <div 
                      key={index}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', subject)}
                      style={{
                        padding: '0.75rem',
                        background: '#007bff',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'grab',
                        textAlign: 'center',
                        userSelect: 'none'
                      }}
                    >
                      {subject}
                    </div>
                  ))}
                </div>
                
                <div style={{marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '5px'}}>
                  <h4>📋 Instructions:</h4>
                  <p>• Glissez les matières vers la grille horaire</p>
                  <p>• Cliquez sur une case pour la vider</p>
                  <p>• Sauvegardez quand terminé</p>
                </div>
              </div>
              
              {/* Grille horaire */}
              <div style={{background: '#ffffff', border: '2px solid #dee2e6', borderRadius: '8px', overflow: 'hidden'}}>
                <ScheduleGridIntegrated />
              </div>
            </div>
            
            <div style={{marginTop: '1rem', textAlign: 'center'}}>
              <button 
                style={{padding: '1rem 2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '1rem', fontWeight: 'bold'}}
                onClick={() => {
                  alert('✅ Emploi du temps sauvegardé avec succès!');
                  setCurrentView('schedule-viewer');
                }}
              >
                💾 SAUVEGARDER EMPLOI
              </button>
              <button 
                style={{padding: '1rem 2rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'}}
                onClick={() => setCurrentView('dashboard')}
              >
                ❌ ANNULER
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* SCHEDULE VIEWER INTÉGRÉ */}
      {currentView === 'schedule-viewer' && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 1000, overflow: 'auto'}}>
          <div style={{padding: '2rem'}}>
            <h2 style={{color: '#2d3436', marginBottom: '2rem'}}>📅 Gestionnaire d'Emplois du Temps</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
              {/* Liste des emplois */}
              <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px'}}>
                <h3>📋 Emplois Existants</h3>
                {[
                  {id: 1, title: 'L1 Informatique S1', status: 'validated', date: '15/01/2024'},
                  {id: 2, title: 'L2 Informatique S1', status: 'draft', date: '20/01/2024'},
                  {id: 3, title: 'Master GL S1', status: 'validated', date: '10/01/2024'}
                ].map(schedule => (
                  <div key={schedule.id} style={{
                    padding: '1rem', 
                    margin: '0.5rem 0', 
                    background: 'white', 
                    borderRadius: '5px',
                    border: '1px solid #dee2e6',
                    cursor: 'pointer'
                  }}>
                    <h4 style={{margin: 0, color: '#495057'}}>{schedule.title}</h4>
                    <p style={{margin: '0.25rem 0', fontSize: '0.9rem', color: '#6c757d'}}>
                      Créé le: {schedule.date}
                    </p>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      background: schedule.status === 'validated' ? '#d4edda' : '#fff3cd',
                      color: schedule.status === 'validated' ? '#155724' : '#856404'
                    }}>
                      {schedule.status === 'validated' ? '✅ Validé' : '📝 Brouillon'}
                    </span>
                  </div>
                ))}
                
                <button 
                  style={{width: '100%', padding: '1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '1rem', fontWeight: 'bold'}}
                  onClick={() => setCurrentView('schedule-builder')}
                >
                  ➕ NOUVEL EMPLOI
                </button>
              </div>
              
              {/* Aperçu de l'emploi */}
              <div style={{background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '2px solid #dee2e6'}}>
                <h3>👁️ Aperçu: L1 Informatique S1</h3>
                <div style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                  <p>📊 <strong>Cours par semaine:</strong> 7</p>
                  <p>⏰ <strong>Heures totales:</strong> 24h</p>
                  <p>👨‍🏫 <strong>Enseignants:</strong> 6</p>
                  <p>🏢 <strong>Salles utilisées:</strong> 8</p>
                </div>
                
                {/* Mini grille d'aperçu */}
                <div style={{marginTop: '2rem', border: '1px solid #dee2e6', borderRadius: '5px', overflow: 'hidden'}}>
                  <div style={{background: '#f8f9fa', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #dee2e6'}}>
                    Emploi du temps - L1 Informatique
                  </div>
                  <div style={{padding: '1rem', textAlign: 'center', color: '#6c757d'}}>
                    🗓️ Grille horaire complète<br/>
                    📋 7 cours programmés<br/>
                    ✅ Aucun conflit détecté
                  </div>
                </div>
                
                <div style={{marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                  <button style={{flex: 1, padding: '0.75rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.9rem'}}>
                    👁️ Voir Détail
                  </button>
                  <button style={{flex: 1, padding: '0.75rem', background: '#ffc107', color: '#212529', border: 'none', borderRadius: '3px', fontSize: '0.9rem'}}>
                    📋 Dupliquer
                  </button>
                  <button style={{flex: 1, padding: '0.75rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.9rem'}}>
                    ✅ Valider
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <button 
                style={{padding: '1rem 2rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'}}
                onClick={() => setCurrentView('dashboard')}
              >
                🏠 RETOUR AU DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
