import { ApiProperty } from '@nestjs/swagger';

export class CreateClasseDto {
  @ApiProperty()
  nom: string;

  @ApiProperty()
  niveauId: number; // lien vers le departement
}
