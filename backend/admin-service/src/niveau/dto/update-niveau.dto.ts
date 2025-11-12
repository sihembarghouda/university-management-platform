import { IsOptional, IsString } from 'class-validator';

export class UpdateNiveauDto {
  @IsString()
  @IsOptional()
  nom?: string;
}
