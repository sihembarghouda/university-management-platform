import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'etudiant_id', nullable: true })
  etudiantId: number;

  @Column({ name: 'enseignant_id', nullable: true })
  enseignantId: number;

  @Column({ name: 'directeur_id', nullable: true })
  directeurId: number;

  @Column()
  type: string; // 'absence', 'note', 'message', 'absence_enseignant', etc.

  @Column()
  titre: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  lu: boolean;

  @Column({ name: 'matiere_nom', nullable: true })
  matiereNom: string;

  @Column({ nullable: true })
  date: string;

  @Column({ name: 'enseignant_nom', nullable: true })
  enseignantNom: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
