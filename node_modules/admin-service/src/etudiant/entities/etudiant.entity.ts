import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Classe } from '../../classe/entities/classe.entity';

@Entity()
export class Etudiant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true, length: 8 }) // TEMPORAIRE: nullable pendant migration
  cin: string;

  @Column({ nullable: true })
  password: string; // Mot de passe haché (bcrypt)

  @Column({ default: true })
  mustChangePassword: boolean; // Force changement de mot de passe au 1er login

  @Column({ nullable: true })
  dateNaissance: Date;

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
  validateCIN() {
    // TEMPORAIRE: validation désactivée pendant migration
    if (this.cin && (this.cin.length !== 8 || !/^\d{8}$/.test(this.cin))) {
      throw new Error('CIN invalide : doit contenir exactement 8 chiffres');
    }
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

  // 🔗 Relation avec Classe
  @ManyToOne(() => Classe, (classe) => classe.etudiants, { eager: true })
  classe: Classe;
}
