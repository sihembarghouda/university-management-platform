import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true, length: 8 })  // TEMPORAIRE: nullable pendant migration
  cin: string;

  @Column({ nullable: false })
  mdp_hash: string;

  @Column({ nullable: false })
  role: string;

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

  @Column({ default: true })
  doit_changer_mdp: boolean;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  confirmationToken: string | null; 

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;
  
}