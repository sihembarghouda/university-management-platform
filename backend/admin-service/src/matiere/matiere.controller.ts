import { Controller, Post, Body, Get } from '@nestjs/common';
import { MatiereService } from './matiere.service';
import { CreateMatiereDto } from './dto/create-matiere.dto';

@Controller('matiere')
export class MatiereController {
  constructor(private readonly matiereService: MatiereService) {}

  @Post()
  create(@Body() dto: CreateMatiereDto) {
    return this.matiereService.create(dto);
  }

  @Get()
  findAll() {
    return this.matiereService.findAll();
  }
}
