import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('specialite')
export class Specialite {
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
  departement_id: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;
}
