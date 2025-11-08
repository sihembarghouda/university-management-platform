// src/matiere/entities/matiere.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Niveau } from '../../niveau/entities/niveau.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';

@Entity()
export class Matiere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  code: string;

  @ManyToOne(() => Departement, (departement) => departement.matieres)
  departement: Departement;

  @ManyToOne(() => Specialite, (specialite) => specialite.matieres)
  specialite: Specialite;

  @ManyToOne(() => Niveau, (niveau) => niveau.matieres)
  niveau: Niveau;

  @ManyToMany(() => Enseignant, (enseignant) => enseignant.matieres)
  @JoinTable()
  enseignants: Enseignant[];
}
