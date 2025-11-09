// src/enseignant/enseignant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Departement } from '../departement/entities/departement.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Classe } from '../classe/entities/classe.entity';
//import { Matiere } from '../matiere/matiere.entity';

@Entity()
export class Enseignant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  grade: string;

  // 🔹 Un enseignant appartient à un seul département
  @ManyToOne(() => Departement, (departement) => departement.enseignants, {
    onDelete: 'CASCADE',
  })
  departement: Departement;

  // 🔹 Un enseignant peut enseigner dans plusieurs spécialités
  @ManyToMany(() => Specialite, (specialite) => specialite.enseignants, {
    cascade: true,
  })
  @JoinTable()
  specialites: Specialite[];

  // 🔹 Un enseignant peut enseigner dans plusieurs classes
  @ManyToMany(() => Classe, (classe) => classe.enseignants, {
    cascade: true,
  })
  @JoinTable()
  classes: Classe[];

  // 🔹 Un enseignant enseigne plusieurs matières
  //@OneToMany(() => Matiere, (matiere) => matiere.enseignant)
  //matieres: Matiere[];
}
