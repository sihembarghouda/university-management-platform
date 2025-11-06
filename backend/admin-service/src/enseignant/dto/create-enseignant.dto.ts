// src/enseignant/dto/create-enseignant.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateEnseignantDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @IsNumber()
  departementId: number;
}
