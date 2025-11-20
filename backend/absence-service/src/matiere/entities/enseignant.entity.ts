import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Matiere } from './matiere.entity';

@Entity('enseignant')
export class Enseignant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nom?: string;

  @Column({ nullable: true })
  prenom?: string;

  @ManyToMany(() => Matiere, (matiere) => matiere.enseignants)
  matieres?: Matiere[];
}
