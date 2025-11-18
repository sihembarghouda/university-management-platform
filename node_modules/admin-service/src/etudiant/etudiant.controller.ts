import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto';

@Controller('etudiants')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}

  @Post()
  create(@Body() dto: CreateEtudiantDto) {
    return this.etudiantService.create(dto);
  }

  @Get()
  findAll() {
    return this.etudiantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.etudiantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEtudiantDto) {
    return this.etudiantService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.etudiantService.remove(+id);
  }
}
