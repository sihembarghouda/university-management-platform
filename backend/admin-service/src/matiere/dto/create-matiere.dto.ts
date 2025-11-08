import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateMatiereDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  departementId: number;

  @IsNumber()
  specialiteId: number;

  @IsNumber()
  niveauId: number;

  @IsArray()
  @IsOptional()
  enseignantsIds?: number[];
}
