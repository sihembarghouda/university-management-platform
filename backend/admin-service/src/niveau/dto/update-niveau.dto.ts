import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateNiveauDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsNumber()
  @IsOptional()
  specialiteId?: number;
}
