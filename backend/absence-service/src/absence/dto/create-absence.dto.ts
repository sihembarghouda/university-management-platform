import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { StatutAbsence, TypeAbsence } from '../absence.entity';

export class CreateAbsenceDto {
  @IsNotEmpty()
  @IsNumber()
  etudiantId: number;

  @IsOptional()
  @IsString()
  etudiantNom?: string;

  @IsOptional()
  @IsString()
  etudiantPrenom?: string;

  @IsNotEmpty()
  @IsNumber()
  matiereId: number;

  @IsOptional()
  @IsString()
  matiereNom?: string;

  @IsNotEmpty()
  @IsDateString()
  dateAbsence: Date;

  @IsOptional()
  @IsString()
  heureDebut?: string;

  @IsOptional()
  @IsString()
  heureFin?: string;

  @IsOptional()
  @IsNumber()
  nbHeures?: number;

  @IsOptional()
  @IsEnum(StatutAbsence)
  statut?: StatutAbsence;

  @IsOptional()
  @IsEnum(TypeAbsence)
  typeJustificatif?: TypeAbsence;

  @IsOptional()
  @IsString()
  motifJustification?: string;

  @IsOptional()
  @IsString()
  pieceJustificative?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsOptional()
  @IsBoolean()
  rattrapage?: boolean;

  @IsOptional()
  @IsDateString()
  dateRattrapage?: Date;

  @IsOptional()
  @IsString()
  heureRattrapage?: string;
}
