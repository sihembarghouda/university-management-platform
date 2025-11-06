import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Niveau } from '../../niveau/entities/niveau.entity';

@Entity()
export class Classe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToOne(() => Niveau, (niveau) => niveau.classes, {
    onDelete: 'CASCADE',
  })
  niveau: Niveau;
}
