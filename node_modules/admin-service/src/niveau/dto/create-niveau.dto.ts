import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNiveauDto {
  @IsString()
  @IsNotEmpty()
  nom: string;
}
