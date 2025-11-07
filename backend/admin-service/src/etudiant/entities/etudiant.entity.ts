import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Classe } from '../../classe/entities/classe.entity';

@Entity()
export class Etudiant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cin: string;

  @Column({ nullable: true })
  dateNaissance: Date;

  // 🔗 Relation avec Classe
  @ManyToOne(() => Classe, (classe) => classe.etudiants, { eager: true })
  classe: Classe;
}
