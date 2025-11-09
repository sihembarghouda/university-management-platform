import { Controller, Get, Post, Body } from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';

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
}
