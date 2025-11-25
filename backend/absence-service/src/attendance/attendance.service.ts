import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Seance } from './entities/seance.entity';
import { Presence } from './entities/presence.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import axios from 'axios';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Seance)
    private seanceRepository: Repository<Seance>,
    
    @InjectRepository(Presence)
    private presenceRepository: Repository<Presence>,
    
    private dataSource: DataSource,
  ) {}

  // Récupérer les étudiants d'une classe
  async getStudentsByClass(classeId: number, matiereId: number) {
    console.log('📚 getStudentsByClass appelé avec:', { classeId, matiereId });
    
    const query = `
      SELECT 
        e.id,
        e.prenom,
        e.nom,
        e.cin
      FROM etudiant e
      WHERE e."classeId" = $1
      ORDER BY e.nom, e.prenom
    `;

    try {
      const students = await this.dataSource.query(query, [classeId]);
      console.log('✅ Étudiants trouvés:', students.length, 'étudiants');
      console.log('👥 Liste:', students);
      return students;
    } catch (error) {
      console.error('❌ Erreur getStudentsByClass:', error);
      throw error;
    }
  }

  // Enregistrer les présences
  async saveAttendance(
    createAttendanceDto: CreateAttendanceDto,
    enseignantId: number,
  ) {
    console.log('💾 saveAttendance appelé:', { 
      createAttendanceDto, 
      enseignantId 
    });
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cours, date, presences } = createAttendanceDto;
      
      console.log('📝 Données extraites:', { cours, date, presences: presences.length });

      // 1. Créer la séance
      const seance = this.seanceRepository.create({
        matiereId: cours.matiere,
        classeId: cours.classe,
        enseignantId: enseignantId,
        date: new Date(date),
        jour: cours.jour,
        horaire: cours.horaire,
      });
      
      console.log('🎓 Séance créée:', seance);

      const savedSeance = await queryRunner.manager.save(seance);
      console.log('✅ Séance enregistrée avec ID:', savedSeance.id);

      // 2. Créer toutes les présences
      const presencesToSave = presences.map((p) => {
        return this.presenceRepository.create({
          seanceId: savedSeance.id,
          etudiantId: p.etudiantId,
          statut: p.statut,
        });
      });
      
      console.log('👥 Présences à enregistrer:', presencesToSave.length);

      await queryRunner.manager.save(presencesToSave);
      console.log('✅ Présences enregistrées');

      // 3. Créer des notifications pour les étudiants absents
      const absentStudents = presences.filter(p => p.statut === 'absent');
      console.log('🔔 Étudiants absents:', absentStudents.length);
      
      if (absentStudents.length > 0) {
        // Récupérer les informations sur la matière et l'enseignant
        const matiereQuery = await this.dataSource.query(
          'SELECT nom FROM matiere WHERE id = $1',
          [cours.matiere]
        );
        const enseignantQuery = await this.dataSource.query(
          'SELECT nom, prenom FROM enseignant WHERE id = $1',
          [enseignantId]
        );

        const matiereNom = matiereQuery[0]?.nom || 'Matière inconnue';
        const enseignantNom = enseignantQuery[0] 
          ? `${enseignantQuery[0].prenom} ${enseignantQuery[0].nom}` 
          : 'Enseignant inconnu';

        // Envoyer les notifications pour chaque étudiant absent
        for (const absentStudent of absentStudents) {
          try {
            // Notification d'absence normale
            await axios.post(
              'http://localhost:3002/api/notifications',
              {
                etudiantId: absentStudent.etudiantId,
                type: 'absence',
                titre: 'Absence enregistrée',
                message: `Vous avez été marqué absent au cours de ${matiereNom} le ${new Date(date).toLocaleDateString('fr-FR')} (${cours.horaire}).`,
                matiereNom: matiereNom,
                date: new Date(date).toLocaleDateString('fr-FR'),
                enseignantNom: enseignantNom,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                }
              }
            );
            console.log('✅ Notification envoyée pour étudiant:', absentStudent.etudiantId);

            // Vérifier le nombre total d'absences dans cette matière
            const absencesCount = await this.dataSource.query(
              `SELECT COUNT(*) as total
               FROM presences p
               JOIN seances s ON p.seance_id = s.id
               WHERE p.etudiant_id = $1 
               AND s.matiere_id = $2 
               AND p.statut = 'absent'`,
              [absentStudent.etudiantId, cours.matiere]
            );

            const totalAbsences = parseInt(absencesCount[0].total);
            console.log(`📊 Étudiant ${absentStudent.etudiantId} - Total absences en ${matiereNom}: ${totalAbsences}`);

            // Si l'étudiant atteint 4 absences, envoyer une alerte d'élimination
            if (totalAbsences >= 4) {
              await axios.post(
                'http://localhost:3002/api/notifications',
                {
                  etudiantId: absentStudent.etudiantId,
                  type: 'elimination',
                  titre: '⚠️ ALERTE ÉLIMINATION',
                  message: `ATTENTION ! Vous avez atteint ${totalAbsences} absences en ${matiereNom}. Vous êtes maintenant ÉLIMINÉ de cette matière. Veuillez contacter l'administration ou votre enseignant.`,
                  matiereNom: matiereNom,
                  date: new Date(date).toLocaleDateString('fr-FR'),
                  enseignantNom: enseignantNom,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              );
              console.log(`🚨 ALERTE ÉLIMINATION envoyée pour étudiant ${absentStudent.etudiantId} - ${totalAbsences} absences en ${matiereNom}`);
            } else if (totalAbsences === 3) {
              // Avertissement à 3 absences
              await axios.post(
                'http://localhost:3002/api/notifications',
                {
                  etudiantId: absentStudent.etudiantId,
                  type: 'avertissement',
                  titre: '⚠️ Avertissement - Risque d\'élimination',
                  message: `ATTENTION ! Vous avez ${totalAbsences} absences en ${matiereNom}. Une absence supplémentaire entraînera votre ÉLIMINATION de cette matière.`,
                  matiereNom: matiereNom,
                  date: new Date(date).toLocaleDateString('fr-FR'),
                  enseignantNom: enseignantNom,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              );
              console.log(`⚠️ Avertissement envoyé pour étudiant ${absentStudent.etudiantId} - ${totalAbsences} absences en ${matiereNom}`);
            }

          } catch (error) {
            console.error('❌ Erreur envoi notification pour étudiant', absentStudent.etudiantId, ':', error.message);
            // Continue même si l'envoi de notification échoue
          }
        }
      }

      await queryRunner.commitTransaction();
      console.log('✅ Transaction commitée');

      return {
        success: true,
        message: 'Présences enregistrées avec succès',
        seanceId: savedSeance.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erreur saveAttendance:', error);
      console.error('❌ Stack:', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Récupérer l'historique des présences
  async getAttendanceHistory(
    matiereId: number,
    classeId: number,
    dateDebut: string,
    dateFin: string,
  ) {
    const query = `
      SELECT 
        s.id as seance_id,
        s.date,
        s.jour,
        s.horaire,
        p.etudiant_id,
        p.statut,
        e.prenom,
        e.nom
      FROM seances s
      LEFT JOIN presences p ON s.id = p.seance_id
      LEFT JOIN etudiant e ON p.etudiant_id = e.id
      WHERE s.matiere_id = $1 
        AND s.classe_id = $2
        AND s.date BETWEEN $3 AND $4
      ORDER BY s.date DESC, e.nom
    `;

    return await this.dataSource.query(query, [
      matiereId,
      classeId,
      dateDebut,
      dateFin,
    ]);
  }

  // Statistiques d'un étudiant
  async getStudentStats(etudiantId: number, semestre: number) {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE p.statut = 'present') as total_presences,
        COUNT(*) FILTER (WHERE p.statut = 'absent') as total_absences,
        COUNT(*) as total_seances
      FROM presences p
      JOIN seances s ON p.seance_id = s.id
      WHERE p.etudiant_id = $1
    `;

    const result = await this.dataSource.query(query, [etudiantId]);
    return result[0];
  }

  // Récupérer les absences d'un étudiant
  async getStudentAbsences(etudiantId: number) {
    console.log('👨‍🎓 Récupération des absences pour l\'étudiant:', etudiantId);

    const query = `
      SELECT 
        p.id,
        p.statut,
        p.created_at,
        s.date,
        s.jour,
        s.horaire,
        m.nom as matiere_nom,
        c.nom as classe_nom
      FROM presences p
      JOIN seances s ON p.seance_id = s.id
      JOIN matiere m ON s.matiere_id = m.id
      JOIN classe c ON s.classe_id = c.id
      WHERE p.etudiant_id = $1 AND p.statut = 'absent'
      ORDER BY s.date DESC, s.horaire DESC
    `;

    try {
      const absences = await this.dataSource.query(query, [etudiantId]);
      console.log('✅ Absences de l\'étudiant trouvées:', absences.length);

      // Calculer les éliminations
      const eliminations = await this.getStudentEliminations(etudiantId);

      // Retourner les absences avec les informations d'élimination
      return {
        absences: absences,
        eliminations: eliminations,
        total_absences: absences.length,
        matieres_elimine: eliminations.length
      };
    } catch (error) {
      console.error('❌ Erreur getStudentAbsences:', error);
      throw error;
    }
  }

  // Calculer les éliminations d'un étudiant
  async getStudentEliminations(etudiantId: number) {
    console.log('📊 Calcul des éliminations pour l\'étudiant:', etudiantId);

    try {
      // Récupérer les absences groupées par matière avec le nombre d'absences
      const absencesQuery = `
        SELECT 
          m.id as matiere_id,
          m.nom as matiere_nom,
          COUNT(p.id) as nombre_absences
        FROM presences p
        JOIN seances s ON p.seance_id = s.id
        JOIN matiere m ON s.matiere_id = m.id
        WHERE p.etudiant_id = $1 AND p.statut = 'absent'
        GROUP BY m.id, m.nom
        ORDER BY m.nom
      `;

      const absencesByMatiere = await this.dataSource.query(absencesQuery, [etudiantId]);
      console.log('📈 Absences par matière:', absencesByMatiere);

      const eliminations = [];

      for (const matiereAbsences of absencesByMatiere) {
        // Déterminer la fréquence hebdomadaire de la matière
        const frequencyQuery = `
          SELECT COUNT(DISTINCT s.jour) as frequence_hebdomadaire
          FROM seances s
          WHERE s.matiere_id = $1
        `;
        
        const frequencyResult = await this.dataSource.query(frequencyQuery, [matiereAbsences.matiere_id]);
        const frequence = frequencyResult[0]?.frequence_hebdomadaire || 1;
        
        console.log('Matière:', matiereAbsences.matiere_nom, '- Fréquence:', frequence, '- Absences:', matiereAbsences.nombre_absences);

        // Appliquer la règle d'élimination
        const seuilElimination = frequence === 1 ? 4 : 7;
        const estElimine = matiereAbsences.nombre_absences >= seuilElimination;

        if (estElimine) {
          eliminations.push({
            matiere_id: matiereAbsences.matiere_id,
            matiere_nom: matiereAbsences.matiere_nom,
            nombre_absences: matiereAbsences.nombre_absences,
            frequence_hebdomadaire: frequence,
            seuil_elimination: seuilElimination,
            est_elimine: true
          });
        }
      }

      console.log('🚫 Éliminations calculées:', eliminations.length);
      return eliminations;
    } catch (error) {
      console.error('❌ Erreur getStudentEliminations:', error);
      throw error;
    }
  }

  // Récupérer les absences pour un enseignant
  async getTeacherAbsences(enseignantId: number) {
    console.log('👨‍🏫 Récupération des absences pour l\'enseignant:', enseignantId);

    const query = `
      SELECT 
        p.id,
        p.statut,
        p.created_at,
        s.date,
        s.jour,
        s.horaire,
        m.nom as matiere_nom,
        c.nom as classe_nom,
        e.prenom as etudiant_prenom,
        e.nom as etudiant_nom,
        e.email as etudiant_email
      FROM presences p
      JOIN seances s ON p.seance_id = s.id
      JOIN matiere m ON s.matiere_id = m.id
      JOIN classe c ON s.classe_id = c.id
      JOIN etudiant e ON p.etudiant_id = e.id
      WHERE s.enseignant_id = $1 AND p.statut = 'absent'
      ORDER BY s.date DESC, s.horaire DESC
    `;

    try {
      const absences = await this.dataSource.query(query, [enseignantId]);
      console.log('✅ Absences trouvées:', absences.length);
      return absences;
    } catch (error) {
      console.error('❌ Erreur getTeacherAbsences:', error);
      throw error;
    }
  }

  // Supprimer une absence
  async deleteAbsence(absenceId: number, enseignantId: number) {
    console.log('🗑️ Suppression de l\'absence:', absenceId, 'par enseignant:', enseignantId);

    try {
      // Vérifier que l'absence appartient à l'enseignant et récupérer les infos nécessaires
      const checkQuery = `
        SELECT p.id, p.etudiant_id, e.prenom as etudiant_prenom, e.nom as etudiant_nom, e.email as etudiant_email,
               m.nom as matiere_nom, s.date, s.horaire
        FROM presences p
        JOIN seances s ON p.seance_id = s.id
        JOIN matiere m ON s.matiere_id = m.id
        JOIN etudiant e ON p.etudiant_id = e.id
        WHERE p.id = $1 AND s.enseignant_id = $2 AND p.statut = 'absent'
      `;
      const absenceInfo = await this.dataSource.query(checkQuery, [absenceId, enseignantId]);

      if (absenceInfo.length === 0) {
        throw new Error('Absence non trouvée ou accès non autorisé');
      }

      const etudiantId = absenceInfo[0].etudiant_id;
      const etudiantInfo = absenceInfo[0];
      const matiereNom = absenceInfo[0].matiere_nom;
      const dateSeance = absenceInfo[0].date;
      const horaireSeance = absenceInfo[0].horaire;

      // Compter les absences de l'étudiant avant suppression
      const countQuery = `
        SELECT COUNT(*) as total_absences
        FROM presences p
        JOIN seances s ON p.seance_id = s.id
        WHERE p.etudiant_id = $1 AND p.statut = 'absent'
      `;
      const countResult = await this.dataSource.query(countQuery, [etudiantId]);
      const absencesCount = parseInt(countResult[0].total_absences);

      console.log(`📊 L'étudiant ${etudiantInfo.etudiant_prenom} ${etudiantInfo.etudiant_nom} avait ${absencesCount} absences`);

      // Supprimer l'absence
      const deleteQuery = `DELETE FROM presences WHERE id = $1`;
      await this.dataSource.query(deleteQuery, [absenceId]);

      console.log(`📊 L'étudiant ${etudiantInfo.etudiant_prenom} ${etudiantInfo.etudiant_nom} avait ${absencesCount} absences`);

      // Envoyer toujours une notification de confirmation de suppression
      try {
        await axios.post(
          'http://localhost:3002/api/notifications',
          {
            etudiantId: etudiantId,
            type: 'absence_deleted',
            titre: 'Absence supprimée',
            message: `Votre absence en ${matiereNom} du ${new Date(dateSeance).toLocaleDateString('fr-FR')} (${horaireSeance}) a été supprimée par votre enseignant.`,
            matiereNom: matiereNom,
            date: new Date(dateSeance).toLocaleDateString('fr-FR'),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        console.log('✅ Notification de suppression d\'absence envoyée à l\'étudiant');
      } catch (notifError) {
        console.error('❌ Erreur lors de l\'envoi de la notification de suppression:', notifError);
      }

      // Si l'étudiant avait 4 absences ou plus (était éliminé), envoyer une notification supplémentaire
      if (absencesCount >= 4) {
        console.log('🚨 Étudiant était éliminé, envoi de notification de grâce');

        try {
          // Envoyer notification supplémentaire de sortie d'élimination
          await axios.post(
            'http://localhost:3002/api/notifications',
            {
              etudiantId: etudiantId,
              type: 'grace',
              titre: 'Absence supprimée - Élimination levée',
              message: `Une absence a été supprimée par votre enseignant. Vous n'êtes plus en situation d'élimination (${absencesCount - 1} absence${absencesCount - 1 > 1 ? 's' : ''} restante${absencesCount - 1 > 1 ? 's' : ''}).`,
              matiereNom: matiereNom,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          console.log('✅ Notification de grâce envoyée à l\'étudiant');
        } catch (notifError) {
          console.error('❌ Erreur lors de l\'envoi de la notification de grâce:', notifError);
        }
      }

      // Ajouter un suivi d'historique des modifications d'absences
      try {
        const historyQuery = `
          INSERT INTO absence_history (etudiant_id, action, absence_count_before, absence_count_after, matiere_nom, date_action, enseignant_id)
          VALUES ($1, 'deleted', $2, $3, $4, NOW(), $5)
        `;
        await this.dataSource.query(historyQuery, [
          etudiantId,
          absencesCount,
          absencesCount - 1,
          matiereNom,
          enseignantId
        ]);
        console.log('✅ Historique d\'absence mis à jour');
      } catch (historyError) {
        console.error('❌ Erreur lors de la mise à jour de l\'historique:', historyError);
      }

      console.log('✅ Absence supprimée avec succès');
      return { success: true, message: 'Absence supprimée avec succès' };

    } catch (error) {
      console.error('❌ Erreur deleteAbsence:', error);
      throw error;
    }
  }

  // Récupérer l'historique des absences d'un étudiant
  async getStudentAbsenceHistory(etudiantId: number) {
    console.log('📚 Récupération de l\'historique des absences pour l\'étudiant:', etudiantId);

    const query = `
      SELECT
        ah.id,
        ah.action,
        ah.absence_count_before,
        ah.absence_count_after,
        ah.matiere_nom,
        ah.date_action,
        ah.details,
        e.prenom as enseignant_prenom,
        e.nom as enseignant_nom
      FROM absence_history ah
      LEFT JOIN enseignant e ON ah.enseignant_id = e.id
      WHERE ah.etudiant_id = $1
      ORDER BY ah.date_action DESC
    `;

    try {
      const history = await this.dataSource.query(query, [etudiantId]);
      console.log('✅ Historique des absences trouvé:', history.length, 'entrées');
      return history;
    } catch (error) {
      console.error('❌ Erreur getStudentAbsenceHistory:', error);
      throw error;
    }
  }
}