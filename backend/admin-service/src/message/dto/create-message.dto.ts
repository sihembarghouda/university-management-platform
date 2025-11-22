import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateMessageDto {
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  receiverRole: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}