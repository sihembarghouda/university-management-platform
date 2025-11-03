import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nom: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
