import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderEmail: string, senderRole: string): Promise<Message> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      senderEmail,
      senderRole,
    });
    return this.messageRepository.save(message);
  }

  async findAllForUser(email: string, role: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { receiverEmail: email, receiverRole: role },
        { senderEmail: email, senderRole: role },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findReceived(email: string, role: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverEmail: email, receiverRole: role },
      order: { createdAt: 'DESC' },
    });
  }

  async findSent(email: string, role: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { senderEmail: email, senderRole: role },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, email: string, role: string): Promise<void> {
    await this.messageRepository.update(
      { id, receiverEmail: email, receiverRole: role },
      { isRead: true },
    );
  }

  async findOne(id: number): Promise<Message | null> {
    return this.messageRepository.findOne({ where: { id } });
  }

  async getUnreadCount(email: string, role: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverEmail: email, receiverRole: role, isRead: false },
    });
  }
}