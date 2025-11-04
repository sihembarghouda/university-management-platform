import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Niveau } from './niveau.entity';

@Entity('classe')
export class Classe {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  nom: string;

  @Column({ unique: true })
  @ApiProperty()
  code: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  niveau_id: number;

  @ManyToOne(() => Niveau, { eager: true })
  @JoinColumn({ name: 'niveau_id' })
  @ApiProperty({ type: () => Niveau, required: false })
  niveau: Niveau;

  @Column({ default: 30 })
  @ApiProperty({ default: 30 })
  capacite: number;

  @Column({ default: 0 })
  @ApiProperty({ default: 0 })
  nombre_etudiants: number;

  @Column({ default: '2024-2025' })
  @ApiProperty({ default: '2024-2025' })
  annee_universitaire: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
