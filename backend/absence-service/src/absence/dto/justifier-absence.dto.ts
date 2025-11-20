import { IsNotEmpty, IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';
import { TypeAbsence } from '../absence.entity';

export class JustifierAbsenceDto {
  @IsNotEmpty()
  @IsEnum(TypeAbsence)
  typeJustificatif: TypeAbsence;

  @IsNotEmpty()
  @IsString()
  motifJustification: string;

  @IsOptional()
  @IsString()
  pieceJustificative?: string;

  @IsOptional()
  @IsDateString()
  dateJustification?: Date;
}
