import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNiveauDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsNumber()
  @IsNotEmpty()
  specialiteId: number;
}
