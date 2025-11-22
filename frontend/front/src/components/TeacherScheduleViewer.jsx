import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import scheduleService from '../services/scheduleService';
import adminService from '../services/adminService';
import './ScheduleViewer.css';

const TeacherScheduleViewer = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [semestre, setSemestre] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00'
  ];

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    if (selectedTeacher) {
      loadTeacherSchedule();
    }
  }, [selectedTeacher, semestre, loadTeacherSchedule]);

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getEnseignants();
      
      // Filter by department if user is director
      const filteredTeachers = user?.role === 'directeur_departement' && user?.departement_id
        ? data.filter(t => t.departement?.id === user.departement_id)
        : data;
      
      setTeachers(filteredTeachers);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des enseignants:', err);
      setError('Impossible de charger la liste des enseignants');
      setLoading(false);
    }
  }, [user]);

  const loadTeacherSchedule = useCallback(async () => {
    if (!selectedTeacher) {
      console.log('⚠️ No teacher selected');
      return;
    }

    console.log('🔄 Loading schedule for teacher:', selectedTeacher, 'Semestre:', semestre);

    try {
      setLoading(true);
      setError(null);
      setSchedule(null);
      
      const data = await scheduleService.getScheduleByTeacher(selectedTeacher.id, semestre);
      console.log('📅 Données emploi du temps reçues du backend:', data);
      console.log('📅 Type de données:', typeof data);
      console.log('📅 Is Array?', Array.isArray(data));
      console.log('📅 Keys:', data ? Object.keys(data) : 'null');
      
      // Vérifier si l'emploi du temps est vide
      const isEmpty = !data || Object.keys(data).length === 0 || 
                      Object.values(data).every(day => !day || day.length === 0);
      
      console.log('📅 Is empty?', isEmpty);
      
      if (isEmpty) {
        setError(`Aucun emploi du temps créé pour ${selectedTeacher.prenom} ${selectedTeacher.nom} au semestre ${semestre}`);
      } else {
        console.log('✅ Setting schedule state with data');
        setSchedule(data);
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('❌ Erreur lors du chargement de l\'emploi du temps:', err);
      setSchedule(null);
      setError('Erreur lors du chargement de l\'emploi du temps');
      setLoading(false);
    }
  }, [selectedTeacher, semestre]);

  const formatScheduleForGrid = (scheduleData) => {
    console.log('🔍 formatScheduleForGrid called with:', scheduleData);
    console.log('🔍 scheduleData keys:', scheduleData ? Object.keys(scheduleData) : 'null/undefined');
    
    // Créer la grille avec tous les jours et tous les créneaux standards
    const grid = {};
    weekDays.forEach(day => {
      grid[day] = {};
      timeSlots.forEach(slot => {
        grid[day][slot] = null;
      });
    });

    if (!scheduleData) {
      console.log('⚠️ No schedule data provided');
      return grid;
    }

    // Remplir la grille avec les cours
    Object.keys(scheduleData).forEach(day => {
      console.log(`📅 Processing day: ${day}, courses:`, scheduleData[day]);
      
      if (scheduleData[day] && Array.isArray(scheduleData[day])) {
        scheduleData[day].forEach(course => {
          console.log('📝 Course data:', course);
          console.log('📝 Matiere type:', typeof course.matiere, course.matiere);
          console.log('📝 Classe type:', typeof course.classe, course.classe);
          console.log('📝 Salle type:', typeof course.salle, course.salle);
          
          const timeSlot = `${course.heureDebut}-${course.heureFin}`;
          console.log(`⏰ Time slot: ${timeSlot}, Day in grid: ${grid[day] !== undefined}`);
          
          // Essayer de trouver le créneau correspondant
          if (grid[day]) {
            // Si le créneau exact existe, l'utiliser
            if (grid[day][timeSlot] !== undefined) {
              console.log(`✅ Exact slot match found for ${timeSlot}`);
              grid[day][timeSlot] = course;
            } else {
              console.log(`⚠️ No exact slot match for ${timeSlot}, trying fallback`);
              // Sinon, trouver le créneau qui contient ce cours (pour compatibilité)
              const courseStart = course.heureDebut;
              const matchingSlot = timeSlots.find(slot => {
                const [slotStart] = slot.split('-');
                return slotStart === courseStart;
              });
              if (matchingSlot && grid[day][matchingSlot] === null) {
                console.log(`✅ Fallback slot match found: ${matchingSlot}`);
                grid[day][matchingSlot] = course;
              } else {
                console.log(`❌ No matching slot found for ${courseStart}`);
              }
            }
          } else {
            console.log(`❌ Day "${day}" not found in grid. Available days:`, Object.keys(grid));
          }
        });
      }
    });

    console.log('🏁 Final grid:', grid);
    return grid;
  };

  const scheduleGrid = formatScheduleForGrid(schedule);

  return (
    <div className="schedule-viewer-container">
      <div className="schedule-viewer-header">
        <h1>📚 Emplois du Temps des Enseignants</h1>
        <p>Consultez les emplois du temps des enseignants de votre département</p>
      </div>

      <div className="schedule-controls">
        <div className="control-group">
          <label>Enseignant :</label>
          <select
            value={selectedTeacher?.id || ''}
            onChange={(e) => {
              const teacher = teachers.find(t => t.id === parseInt(e.target.value));
              setSelectedTeacher(teacher);
            }}
            className="control-select"
          >
            <option value="">-- Sélectionner un enseignant --</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.prenom} {teacher.nom} - {teacher.specialite_enseignement || 'Non spécifié'}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Semestre :</label>
          <select
            value={semestre}
            onChange={(e) => setSemestre(parseInt(e.target.value))}
            className="control-select"
          >
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </select>
        </div>
      </div>

      {selectedTeacher && (
        <div className="teacher-info-card">
          <h3>👨‍🏫 {selectedTeacher.prenom} {selectedTeacher.nom}</h3>
          <p>Email: {selectedTeacher.email}</p>
          {selectedTeacher.departement && (
            <p>Département: {selectedTeacher.departement.nom}</p>
          )}
          {selectedTeacher.specialite_enseignement && (
            <p>Spécialité: {selectedTeacher.specialite_enseignement}</p>
          )}
        </div>
      )}

      {loading && <div className="loading">⏳ Chargement...</div>}

      {error && !loading && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && schedule && !error && selectedTeacher && (
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
                {weekDays.map(day => {
                  const course = scheduleGrid[day]?.[timeSlot];
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="schedule-cell"
                    >
                      {course ? (
                        <div 
                          className="course-info"
                          style={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div className="course-name">
                            <strong>
                              {(() => {
                                if (typeof course.matiere === 'object' && course.matiere?.nom) {
                                  return course.matiere.nom;
                                } else if (typeof course.matiere === 'string') {
                                  return course.matiere;
                                }
                                return 'Matière';
                              })()}
                            </strong>
                          </div>
                          {(() => {
                            const classeText = typeof course.classe === 'object' 
                              ? course.classe?.nom 
                              : (typeof course.classe === 'string' ? course.classe : null);
                            return classeText ? (
                              <div className="course-class">
                                🎓 {classeText}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const salleText = typeof course.salle === 'object' 
                              ? course.salle?.nom 
                              : (typeof course.salle === 'string' ? course.salle : null);
                            return salleText ? (
                              <div className="course-room">
                                🏢 {salleText}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <div className="empty-cell">
                          <span className="empty-icon">-</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !selectedTeacher && (
        <div className="no-selection">
          <p>👆 Veuillez sélectionner un enseignant pour voir son emploi du temps</p>
        </div>
      )}
    </div>
  );
};

export default TeacherScheduleViewer;
