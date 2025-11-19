import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmploiDto {
  @ApiProperty()
  @IsNumber()
  classeId: number;

  @ApiProperty()
  @IsNumber()
  enseignantId: number;

  @ApiProperty()
  @IsNumber()
  salleId: number;

  @ApiProperty()
  @IsNumber()
  matiereId: number;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  heureDebut: string;

  @ApiProperty()
  @IsNotEmpty()
  heureFin: string;

  @ApiProperty({ description: 'Numéro du semestre (1 ou 2)' })
  @IsNumber()
  semestre: number;
}