import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class SpecialiteEnseignement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: true })
  domaine: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Validation avant insertion/mise à jour
  @BeforeInsert()
  @BeforeUpdate()
  validateNom() {
    if (this.nom) this.nom = this.nom.trim();
    if (!this.nom) {
      throw new Error("Le nom de la spécialité d'enseignement est obligatoire");
    }
  }
}
