import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('emplois_du_temps')
export class EmploiDuTemps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classeId: number;

  @Column()
  enseignantId: number;

  @Column()
  salleId: number;

  @Column()
  matiereId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  heureDebut: string;

  @Column({ type: 'time' })
  heureFin: string;

  @Column({ type: 'int', default: 1 })
  semestre: number;
}