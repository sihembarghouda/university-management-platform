// src/enseignant/enseignant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm';
import { Departement } from '../departement/entities/departement.entity';
import { SpecialiteEnseignement } from './specialite-enseignement.entity';
import { Matiere } from '../matiere/entities/matiere.entity';

@Entity()
export class Enseignant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true, length: 8 })
  cin: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  password: string; // Mot de passe haché (bcrypt)

  @Column({ default: true })
  mustChangePassword: boolean; // Force changement de mot de passe au 1er login

  @Column({ default: 'enseignant' })
  role: string; // 'enseignant' ou 'directeur_departement'

  @Column({ nullable: true })
  grade: string;

  // Validation avant insertion/mise à jour
  @BeforeInsert()
  @BeforeUpdate()
  validateEmail() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Email invalide : doit contenir @');
    }
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateNomPrenom() {
    if (this.nom) this.nom = this.nom.trim();
    if (this.prenom) this.prenom = this.prenom.trim();
    if (!this.nom || !this.prenom) {
      throw new Error('Nom et prénom sont obligatoires');
    }
  }

  // 🔹 Un enseignant appartient à un seul département
  @ManyToOne(() => Departement, (departement) => departement.enseignants, {
    onDelete: 'CASCADE',
  })
  departement: Departement;

  // 🔹 Un enseignant a UNE SEULE spécialité d'enseignement (sa matière d'expertise)
  @ManyToOne(() => SpecialiteEnseignement, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  specialiteEnseignement: SpecialiteEnseignement;

  // ❌ RETIRÉ: classes - Les classes changent chaque année via l'emploi du temps
  // L'association enseignant-classe se fera via un module "Emploi du Temps" ou "Affectation"
  @ManyToMany(() => Matiere, (matiere) => matiere.enseignants)
  matieres: Matiere[];
}
