import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';

export type Equipement =
  | 'Projecteur'
  | 'Ordinateurs'
  | 'Tableau'
  | 'Wifi'
  | 'Climatisation'
  | 'Microphone'
  | 'Cameras'
  | 'Prises';

@Entity()
export class Salle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  nom: string;

  @Column({ default: 'normale' })
  type: string; // normale | laboratoire | amphitheatre

  @Column({ type: 'int', default: 0 })
  capacite: number;

  @Column({ nullable: true })
  batiment?: string;

  @Column({ nullable: true })
  etage?: string;

  // stocke un tableau simple comme "Projecteur,Wifi,Climatisation"
  @Column('simple-array', { nullable: true })
  equipements?: string[];

  @ManyToOne(() => Departement, (dep) => dep.salles, { eager: true })
  departement: Departement;
}
