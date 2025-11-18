import { ApiProperty } from '@nestjs/swagger';

export class CreateClasseDto {
  // ❌ nom retiré - généré automatiquement à partir de niveau + spécialité

  @ApiProperty()
  niveauId: number; // Niveau de la classe (1ère année, 2ème année, etc.)

  @ApiProperty()
  specialiteId: number; // Spécialité de la classe (DSI, RSI, TI, etc.)
}
