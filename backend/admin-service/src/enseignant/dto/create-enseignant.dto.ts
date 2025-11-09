// src/enseignant/dto/create-enseignant.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateEnseignantDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  grade: string;

  @IsNumber()
  departementId: number;

  @IsArray()
  specialiteIds: number[];

  @IsArray()
  classeIds: number[];
}
