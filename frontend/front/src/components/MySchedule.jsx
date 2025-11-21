import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { scheduleService } from '../services/scheduleService';
import './ScheduleViewer.css';

const MySchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  const handleBack = () => {
    if (user.role === 'etudiant') {
      navigate('/student-dashboard');
    } else if (user.role === 'enseignant' || user.role === 'directeur_departement') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/');
    }
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
    <div className="schedule-viewer">
      <header className="schedule-header">
        <div className="header-left">
          <button 
            className="back-btn"
            onClick={handleBack}
          >
            ← Retour
          </button>
          <div>
            <h1>📅 Mon Emploi du Temps</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              {user?.prenom} {user?.nom} - {user?.role === 'etudiant' ? 'Étudiant' : 'Enseignant'}
            </p>
          </div>
        </div>
        <div className="header-right">
          <select
            value={semestre}
            onChange={(e) => setSemestre(parseInt(e.target.value))}
            className="semestre-selector"
          >
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p className="error-icon">ℹ️</p>
          <p>{error}</p>
        </div>
      )}

      {!error && (
        <div className="schedule-grid-container">
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
                          <strong>{schedule[day][timeSlot].matiere}</strong>
                        </div>
                        {user.role === 'etudiant' && (
                          <div className="course-teacher">
                            👨‍🏫 {schedule[day][timeSlot].enseignant}
                          </div>
                        )}
                        {(user.role === 'enseignant' || user.role === 'directeur_departement') && (
                          <div className="course-class">
                            🎓 {schedule[day][timeSlot].classe}
                          </div>
                        )}
                        <div className="course-room">
                          🏢 {schedule[day][timeSlot].salle}
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
