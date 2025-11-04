import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClasseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'L1-DSI-G1', description: 'Nom de la classe' })
  nom: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'L1-DSI-G1',
    description: 'Code unique de la classe',
  })
  code: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID du niveau', required: false })
  niveau_id?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiProperty({
    example: 30,
    description: 'Capacité maximale',
    default: 30,
    required: false,
  })
  capacite?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2024-2025',
    description: 'Année universitaire',
    default: '2024-2025',
    required: false,
  })
  annee_universitaire?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Classe de première année DSI groupe 1',
    required: false,
  })
  description?: string;
}
