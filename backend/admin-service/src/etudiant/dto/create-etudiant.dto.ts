import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEtudiantDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cin: string;

  @IsNumber()
  classeId: number;
}
