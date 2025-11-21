import { IsOptional, IsInt, IsString, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmploiDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  classeId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  enseignantId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  salleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  matiereId?: number;

  @ApiProperty({ required: false, example: '2024-01-15' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ required: false, example: '08:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'heureDebut doit être au format HH:mm' })
  heureDebut?: string;

  @ApiProperty({ required: false, example: '10:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'heureFin doit être au format HH:mm' })
  heureFin?: string;

  @ApiProperty({ required: false, enum: [1, 2] })
  @IsOptional()
  @IsInt()
  @Min(1)
  semestre?: number;
}
