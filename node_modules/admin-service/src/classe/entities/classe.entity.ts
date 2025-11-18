// src/classe/classe.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Niveau } from '../../niveau/entities/niveau.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Etudiant } from '../../etudiant/entities/etudiant.entity';
import { Matiere } from '../../matiere/entities/matiere.entity';

@Entity()
export class Classe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nom: string;

  // Validation avant insertion/mise à jour
  @BeforeInsert()
  @BeforeUpdate()
  validateNom() {
    if (this.nom) this.nom = this.nom.trim();
    if (!this.nom) {
      throw new Error('Le nom de la classe est obligatoire');
    }
  }

  @ManyToOne(() => Niveau, (niveau) => niveau.classes, {
    onDelete: 'CASCADE',
  })
  niveau: Niveau;

  @ManyToOne(() => Specialite, (specialite) => specialite.classes, {
    onDelete: 'CASCADE',
  })
  specialite: Specialite;

  // ❌ RETIRÉ: enseignants - Les classes changent chaque année, géré via emploi du temps

  @OneToMany(() => Etudiant, (etudiant) => etudiant.classe)
  etudiants: Etudiant[];
  @OneToMany(() => Matiere, (matiere) => matiere.classe)
  matieres: Matiere[];
}
