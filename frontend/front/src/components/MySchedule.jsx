import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { scheduleService } from '../services/scheduleService';
// Import limité: on évite styles globaux potentiels de layout/sidebar
import './ScheduleViewer.css';

const MySchedule = () => {
  const { user } = useAuth();
  
  const [scheduleData, setScheduleData] = useState(null);
  const [semestre, setSemestre] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Créneaux horaires standards
  const timeSlots = [
    '08:00-09:30',
    '09:45-11:15', 
    '11:30-13:00',
    '14:00-15:30',
    '15:45-17:15'
  ];

  // Jours de la semaine
  const weekDays = [
    'Lundi',
    'Mardi', 
    'Mercredi',
    'Jeudi',
    'Vendredi'
  ];

  useEffect(() => {
    loadMySchedule();
  }, [semestre]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMySchedule = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await scheduleService.getMySchedule(user, semestre);
      setScheduleData(data);
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', err);
      setScheduleData(null);
      setError(err.response?.data?.message || 'Aucun emploi du temps disponible');
      setLoading(false);
    }
  };

  const formatScheduleForGrid = (scheduleData) => {
    const grid = {};
    weekDays.forEach(day => {
      grid[day] = {};
      timeSlots.forEach(slot => {
        grid[day][slot] = null;
      });
    });

    if (!scheduleData) return grid;

    Object.entries(scheduleData).forEach(([jour, courses]) => {
      courses.forEach(course => {
        const timeSlot = `${course.heureDebut}-${course.heureFin}`;
        if (grid[jour] && timeSlots.includes(timeSlot)) {
          grid[jour][timeSlot] = course;
        }
      });
    });

    return grid;
  };

  const getCourseStyle = (course) => {
    if (!course) return {};
    
    return {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      height: '100%'
    };
  };

  if (loading) {
    return (
      <div className="schedule-viewer-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre emploi du temps...</p>
      </div>
    );
  }

  const schedule = formatScheduleForGrid(scheduleData);

  return (
    <div className="my-schedule-page" style={{ padding: '24px', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header simplifié sans bouton retour */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>Mon Emploi du Temps</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{user?.prenom} {user?.nom}</p>
        </div>
        
        <select
          value={semestre}
          onChange={(e) => setSemestre(parseInt(e.target.value))}
          className="semestre-selector"
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none'
          }}
        >
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
      </div>

      {error && (
        <div className="error-message" style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <p className="error-icon" style={{ fontSize: '24px', margin: 0 }}>ℹ️</p>
          <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      {!error && (
        <div className="schedule-grid-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="schedule-grid">
            <div className="grid-header">
              <div className="time-header">Horaires</div>
              {weekDays.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>
            
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="grid-row">
                <div className="time-slot">{timeSlot}</div>
                {weekDays.map(day => (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="schedule-cell"
                  >
                    {schedule[day]?.[timeSlot] ? (
                      <div 
                        className="course-info"
                        style={getCourseStyle(schedule[day][timeSlot])}
                      >
                        <div className="course-name">
                          <strong>
                            {(() => {
                              const course = schedule[day][timeSlot];
                              if (typeof course.matiere === 'object' && course.matiere?.nom) {
                                return course.matiere.nom;
                              } else if (typeof course.matiere === 'string') {
                                return course.matiere;
                              }
                              return 'Matière';
                            })()}
                          </strong>
                        </div>
                        {user.role === 'etudiant' && (
                          <div className="course-teacher">
                            👨‍🏫 {(() => {
                              const course = schedule[day][timeSlot];
                              if (typeof course.enseignant === 'object') {
                                return course.enseignant?.prenom && course.enseignant?.nom
                                  ? `${course.enseignant.prenom} ${course.enseignant.nom}`
                                  : 'Enseignant';
                              }
                              return course.enseignant || 'Enseignant';
                            })()}
                          </div>
                        )}
                        {(user.role === 'enseignant' || user.role === 'directeur_departement') && (
                          <div className="course-class">
                            🎓 {(() => {
                              const course = schedule[day][timeSlot];
                              if (typeof course.classe === 'object' && course.classe?.nom) {
                                return course.classe.nom;
                              } else if (typeof course.classe === 'string') {
                                return course.classe;
                              }
                              return 'Classe';
                            })()}
                          </div>
                        )}
                        <div className="course-room">
                          🏢 {(() => {
                            const course = schedule[day][timeSlot];
                            if (typeof course.salle === 'object' && course.salle?.nom) {
                              return course.salle.nom;
                            } else if (typeof course.salle === 'string') {
                              return course.salle;
                            }
                            return 'Salle';
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-cell">
                        <span className="empty-icon">-</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;