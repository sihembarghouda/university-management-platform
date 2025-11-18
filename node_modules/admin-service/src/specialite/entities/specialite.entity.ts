// src/specialite/specialite.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Niveau } from '../../niveau/entities/niveau.entity';
import { Classe } from '../../classe/entities/classe.entity';
import { Matiere } from '../../matiere/entities/matiere.entity';
@Entity()
export class Specialite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  // Validation avant insertion/mise à jour
  @BeforeInsert()
  @BeforeUpdate()
  validateNom() {
    if (this.nom) this.nom = this.nom.trim();
    if (!this.nom) {
      throw new Error('Le nom de la spécialité est obligatoire');
    }
  }

  @ManyToOne(() => Departement, (departement) => departement.specialites, {
    onDelete: 'CASCADE',
  })
  departement: Departement;

  @ManyToOne(() => Niveau, (niveau) => niveau.specialites, {
    onDelete: 'CASCADE',
  })
  niveau: Niveau;

  @OneToMany(() => Classe, (classe) => classe.specialite)
  classes: Classe[];
  @OneToMany(() => Matiere, (matiere) => matiere.specialite)
  matieres: Matiere[];
}
