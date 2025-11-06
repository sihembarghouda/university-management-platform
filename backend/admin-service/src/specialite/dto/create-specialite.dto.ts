import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialiteDto {
  @ApiProperty()
  nom: string;

  @ApiProperty()
  departementId: number;
}
