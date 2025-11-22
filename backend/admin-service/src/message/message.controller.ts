import { Controller, Get, Post, Body, Param, Patch, Headers } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Headers('x-user-email') senderEmail: string, @Headers('x-user-role') senderRole: string) {
    return this.messageService.create(createMessageDto, senderEmail, senderRole);
  }

  @Get()
  findAll(@Headers('x-user-email') email: string, @Headers('x-user-role') role: string) {
    return this.messageService.findAllForUser(email, role);
  }

  @Get('received')
  findReceived(@Headers('x-user-email') email: string, @Headers('x-user-role') role: string) {
    return this.messageService.findReceived(email, role);
  }

  @Get('sent')
  findSent(@Headers('x-user-email') email: string, @Headers('x-user-role') role: string) {
    return this.messageService.findSent(email, role);
  }

  @Get('unread-count')
  getUnreadCount(@Headers('x-user-email') email: string, @Headers('x-user-role') role: string) {
    return this.messageService.getUnreadCount(email, role);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Headers('x-user-email') email: string, @Headers('x-user-role') role: string) {
    return this.messageService.markAsRead(+id, email, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }
}