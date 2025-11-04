import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Specialite } from './specialite.entity';

@Entity('niveau')
export class Niveau {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  nom: string;

  @Column({ unique: true })
  @ApiProperty()
  code: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  specialite_id: number;

  @ManyToOne(() => Specialite, { eager: true })
  @JoinColumn({ name: 'specialite_id' })
  @ApiProperty({ type: () => Specialite, required: false })
  specialite: Specialite;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  ordre: number;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
