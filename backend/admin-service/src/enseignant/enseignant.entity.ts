// src/enseignant/enseignant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Departement } from '../departement/entities/departement.entity';
@Entity()
export class Enseignant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Departement, (departement) => departement.enseignants, {
    onDelete: 'CASCADE',
  })
  departement: Departement;
}
