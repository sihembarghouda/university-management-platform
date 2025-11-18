import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Classe } from '../../classe/entities/classe.entity';
import { Matiere } from '../../matiere/entities/matiere.entity';

@Entity()
export class Niveau {
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
      throw new Error('Le nom du niveau est obligatoire');
    }
  }

  @OneToMany(() => Specialite, (specialite) => specialite.niveau, {
    cascade: true,
  })
  specialites: Specialite[];

  @OneToMany(() => Classe, (classe) => classe.niveau, {
    cascade: true,
  })
  classes: Classe[];
  @OneToMany(() => Matiere, (matiere) => matiere.niveau)
  matieres: Matiere[];
}
