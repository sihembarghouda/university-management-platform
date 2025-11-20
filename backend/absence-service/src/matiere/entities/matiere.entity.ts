import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Enseignant } from './enseignant.entity';

@Entity('matiere')
export class Matiere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  code: string;

  @ManyToMany(() => Enseignant, (e) => e.matieres, { eager: true })
  @JoinTable()
  enseignants: Enseignant[];
}
