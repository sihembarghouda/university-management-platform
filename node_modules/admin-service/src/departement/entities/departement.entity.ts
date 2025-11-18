import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';
import { Salle } from '../../salle/entities/salle.entity';
import { Matiere } from '../../matiere/entities/matiere.entity';

@Entity()
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nom: string;

  // Rendre temporairement nullable pour permettre la synchronisation avec des lignes existantes
  // qui n'ont pas encore de code. On pourra remplir puis remettre non-nullable.
  @Column({ unique: true, nullable: true })
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
  @OneToMany(() => Salle, (salle) => salle.departement)
  salles: Salle[];

  @OneToMany(() => Matiere, (matiere) => matiere.departement)
  matieres: Matiere[];
}
