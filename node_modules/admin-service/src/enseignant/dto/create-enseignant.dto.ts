import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  cin?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  role?: string; // 'enseignant' ou 'directeur_departement'

  @IsString()
  grade: string;

  @IsNumber()
  departementId: number;

  @IsNumber()
  specialiteEnseignementId: number; // UNE SEULE spécialité d'enseignement
}
