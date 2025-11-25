import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsNumber()
  etudiantId?: number;

  @IsOptional()
  @IsNumber()
  enseignantId?: number;

  @IsOptional()
  @IsNumber()
  directeurId?: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  titre: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  matiereNom?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  enseignantNom?: string;
}
