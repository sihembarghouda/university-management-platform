import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartementDto {
  @ApiProperty()
  nom: string;
}
