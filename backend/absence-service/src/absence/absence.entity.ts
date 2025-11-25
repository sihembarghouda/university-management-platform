import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum StatutAbsence {
  NON_JUSTIFIEE = 'non_justifiee',
  JUSTIFIEE = 'justifiee',
  EN_ATTENTE = 'en_attente',
  REFUSEE = 'refusee'
}

export enum TypeAbsence {
  MALADIE = 'maladie',
  PERSONNEL = 'personnel',
  ADMINISTRATIF = 'administratif',
  AUTRE = 'autre'
}

@Entity('absence')
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  etudiantId?: number;

  @Column({ nullable: true })
  etudiantNom?: string;

  @Column({ nullable: true })
  etudiantPrenom?: string;

  @Column()
  matiereId: number;

  @Column({ nullable: true })
  matiereNom?: string;

  @Column({ type: 'date' })
  dateAbsence: Date;

  @Column({ nullable: true })
  heureDebut?: string;

  @Column({ nullable: true })
  heureFin?: string;

  @Column({ type: 'int', default: 1 })
  nbHeures: number;

  @Column({
    type: 'enum',
    enum: StatutAbsence,
    default: StatutAbsence.NON_JUSTIFIEE
  })
  statut: StatutAbsence;

  @Column({
    type: 'enum',
    enum: TypeAbsence,
    nullable: true
  })
  typeJustificatif?: TypeAbsence;

  @Column({ type: 'text', nullable: true })
  motifJustification?: string;

  @Column({ nullable: true })
  pieceJustificative?: string;

  @Column({ type: 'date', nullable: true })
  dateJustification?: Date;

  @Column({ type: 'text', nullable: true })
  commentaire?: string;

  @Column({ type: 'boolean', default: false })
  rattrapage: boolean;

  @Column({ type: 'date', nullable: true })
  dateRattrapage?: Date;

  @Column({ nullable: true })
  heureRattrapage?: string;

  @Column({ type: 'boolean', default: false })
  rattrapageEffectue: boolean;

  @Column({ type: 'boolean', default: false })
  alerteEliminationEnvoyee: boolean;

  // If the absence concerns an enseignant instead of an etudiant
  @Column({ nullable: true })
  enseignantId?: number;

  @Column({ type: 'varchar', length: 20, default: 'etudiant' })
  sujet: 'etudiant' | 'enseignant';

  @CreateDateColumn()
  createdAt: Date;
}
