import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderEmail: string;

  @Column()
  senderRole: string; // 'etudiant', 'enseignant', 'administratif', 'directeur_departement'

  @Column()
  receiverEmail: string;

  @Column()
  receiverRole: string;

  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}