import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Niveau } from '../../niveau/entities/niveau.entity';

@Entity()
export class Specialite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToOne(() => Departement, (departement) => departement.specialites, {
    onDelete: 'CASCADE',
  })
  departement: Departement;

  @OneToMany(() => Niveau, (niveau) => niveau.specialite, {
    cascade: true,
  })
  niveaux: Niveau[];
}
