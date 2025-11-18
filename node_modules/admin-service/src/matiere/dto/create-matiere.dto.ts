import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
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

  @IsOptional()
  @IsNumber()
  specialiteId?: number;

  @IsOptional()
  @IsNumber()
  niveauId?: number;

  @IsOptional()
  @IsArray()
  enseignantsIds?: number[];

  @IsOptional()
  @IsNumber()
  classeId?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
