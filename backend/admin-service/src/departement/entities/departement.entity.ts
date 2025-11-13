import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';

@Entity()
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nom: string;

  @Column({ unique: true, nullable: false })
  code: string;

  // Validation avant insertion/mise à jour
  @BeforeInsert()
  @BeforeUpdate()
  validateNom() {
    if (this.nom) this.nom = this.nom.trim();
    if (!this.nom) {
      throw new Error('Le nom du département est obligatoire');
    }
  }

  @OneToMany(() => Specialite, (specialite) => specialite.departement, {
    cascade: true,
  })
  specialites: Specialite[];

  @OneToMany(() => Enseignant, (enseignant) => enseignant.departement)
  enseignants: Enseignant[];
}
