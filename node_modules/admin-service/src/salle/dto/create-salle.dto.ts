import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateSalleDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  capacite: number;

  @IsOptional()
  @IsString()
  batiment?: string;

  @IsOptional()
  @IsString()
  etage?: string;

  @IsOptional()
  @IsArray()
  equipements?: string[];

  @IsNumber()
  departementId: number;
}
