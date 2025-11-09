// src/specialite/specialite.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Niveau } from '../../niveau/entities/niveau.entity';
import { Classe } from '../../classe/entities/classe.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';
@Entity()
export class Specialite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToOne(() => Departement, (departement) => departement.specialites, {
    onDelete: 'CASCADE',
  })
  departement: Departement;

  @OneToMany(() => Niveau, (niveau) => niveau.specialite)
  niveaux: Niveau[];

  @OneToMany(() => Classe, (classe) => classe.specialite)
  classes: Classe[];

  // 🔹 Relation inverse pour le ManyToMany avec Enseignant
  @ManyToMany(() => Enseignant, (enseignant) => enseignant.specialites)
  enseignants: Enseignant[];
}
