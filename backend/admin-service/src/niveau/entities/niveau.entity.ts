import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Specialite } from '../../specialite/entities/specialite.entity';
import { Classe } from '../../classe/entities/classe.entity';

@Entity()
export class Niveau {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToOne(() => Specialite, (specialite) => specialite.niveaux, {
    onDelete: 'CASCADE',
  })
  specialite: Specialite;

  @OneToMany(() => Classe, (classe) => classe.niveau, {
    cascade: true,
  })
  classes: Classe[];
}
