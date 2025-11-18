import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Niveau } from '../../niveau/entities/niveau.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';
import { Classe } from '../../classe/entities/classe.entity';

@Entity()
export class Matiere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  code: string;

  // Département obligatoire
  @ManyToOne(() => Departement, (d) => d.matieres, { eager: true })
  departement: Departement;

  // Spécialité optionnelle
  @ManyToOne(() => Specialite, (s) => s.matieres, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  specialite: Specialite;

  // Niveau optionnel
  @ManyToOne(() => Niveau, (n) => n.matieres, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  niveau: Niveau;

  // Classe optionnelle
  @ManyToOne(() => Classe, (c) => c.matieres, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  classe: Classe;

  // Plusieurs enseignants
  @ManyToMany(() => Enseignant, (e) => e.matieres, { eager: true })
  @JoinTable()
  enseignants: Enseignant[];

  @Column({ nullable: true, type: 'text' })
  description?: string;
}
