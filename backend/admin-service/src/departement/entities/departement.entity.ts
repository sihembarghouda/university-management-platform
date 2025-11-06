import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';

@Entity()
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Specialite, (specialite) => specialite.departement, {
    cascade: true,
  })
  specialites: Specialite[];
}
