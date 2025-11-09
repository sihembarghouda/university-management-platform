import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Enseignant } from '../../enseignant/enseignant.entity';
@Entity()
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Specialite, (specialite) => specialite.departement, {
    cascade: true,
  })
  @OneToMany(() => Enseignant, (enseignant) => enseignant.departement)
  enseignants: Enseignant[];

  specialites: Specialite[];
}
