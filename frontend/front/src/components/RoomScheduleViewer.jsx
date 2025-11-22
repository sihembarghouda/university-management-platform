import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import scheduleService from '../services/scheduleService';
import adminService from '../services/adminService';
import './ScheduleViewer.css';

const RoomScheduleViewer = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
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
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadRoomSchedule();
    }
  }, [selectedRoom, semestre, loadRoomSchedule]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSalles();
      setRooms(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des salles:', err);
      setError('Impossible de charger la liste des salles');
      setLoading(false);
    }
  };

  const loadRoomSchedule = useCallback(async () => {
    if (!selectedRoom) return;

    try {
      setLoading(true);
      setError(null);
      setSchedule(null);
      
      const data = await scheduleService.getScheduleBySalle(selectedRoom.id, semestre);
      console.log('🏛️ Données emploi du temps salle reçues:', data);
      
      // Vérifier si l'emploi du temps est vide
      const isEmpty = !data || Object.keys(data).length === 0 || 
                      Object.values(data).every(day => !day || day.length === 0);
      
      if (isEmpty) {
        setError(`Aucun cours planifié dans la salle ${selectedRoom.nom} au semestre ${semestre}`);
      } else {
        setSchedule(data);
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', err);
      setSchedule(null);
      setError('Erreur lors du chargement de l\'emploi du temps');
      setLoading(false);
    }
  }, [selectedRoom, semestre]);

  const formatScheduleForGrid = (scheduleData) => {
    // Créer la grille avec tous les jours et tous les créneaux standards
    const grid = {};
    weekDays.forEach(day => {
      grid[day] = {};
      timeSlots.forEach(slot => {
        grid[day][slot] = null;
      });
    });

    if (!scheduleData) return grid;

    // Remplir la grille avec les cours
    Object.keys(scheduleData).forEach(day => {
      if (scheduleData[day] && Array.isArray(scheduleData[day])) {
        scheduleData[day].forEach(course => {
          const timeSlot = `${course.heureDebut}-${course.heureFin}`;
          // Essayer de trouver le créneau correspondant
          if (grid[day]) {
            // Si le créneau exact existe, l'utiliser
            if (grid[day][timeSlot] !== undefined) {
              grid[day][timeSlot] = course;
            } else {
              // Sinon, trouver le créneau qui contient ce cours (pour compatibilité)
              const courseStart = course.heureDebut;
              const matchingSlot = timeSlots.find(slot => {
                const [slotStart] = slot.split('-');
                return slotStart === courseStart;
              });
              if (matchingSlot && grid[day][matchingSlot] === null) {
                grid[day][matchingSlot] = course;
              }
            }
          }
        });
      }
    });

    return grid;
  };

  const scheduleGrid = formatScheduleForGrid(schedule);

  return (
    <div className="schedule-viewer-container">
      <div className="schedule-viewer-header">
        <h1>🏛️ Emplois du Temps des Salles</h1>
        <p>Consultez les emplois du temps et la disponibilité des salles</p>
      </div>

      <div className="schedule-controls">
        <div className="control-group">
          <label>Salle :</label>
          <select
            value={selectedRoom?.id || ''}
            onChange={(e) => {
              const room = rooms.find(r => r.id === parseInt(e.target.value));
              setSelectedRoom(room);
            }}
            className="control-select"
          >
            <option value="">-- Sélectionner une salle --</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.nom} - Capacité: {room.capacite || 'N/A'}
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

      {selectedRoom && (
        <div className="teacher-info-card">
          <h3>🏛️ {selectedRoom.nom}</h3>
          {selectedRoom.capacite && <p>Capacité: {selectedRoom.capacite} places</p>}
          {selectedRoom.type && <p>Type: {selectedRoom.type}</p>}
        </div>
      )}

      {loading && <div className="loading">⏳ Chargement...</div>}

      {error && !loading && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && schedule && !error && selectedRoom && (
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
                            const enseignantText = typeof course.enseignant === 'object'
                              ? (course.enseignant?.prenom && course.enseignant?.nom 
                                  ? `${course.enseignant.prenom} ${course.enseignant.nom}` 
                                  : null)
                              : (typeof course.enseignant === 'string' ? course.enseignant : null);
                            return enseignantText ? (
                              <div className="course-teacher">
                                👨‍🏫 {enseignantText}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <div className="empty-cell">
                          <span className="empty-icon">✓</span>
                          <span>Disponible</span>
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

      {!loading && !selectedRoom && (
        <div className="no-selection">
          <p>👆 Veuillez sélectionner une salle pour voir son emploi du temps</p>
        </div>
      )}
    </div>
  );
};

export default RoomScheduleViewer;
