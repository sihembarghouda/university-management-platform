// src/enseignant/enseignant.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { EnseignantService } from './enseignant.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

@Controller('enseignant')
export class EnseignantController {
  constructor(private readonly enseignantService: EnseignantService) {}

  @Post()
  create(@Body() dto: CreateEnseignantDto) {
    return this.enseignantService.create(dto);
  }

  @Get()
  findAll() {
    return this.enseignantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enseignantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEnseignantDto) {
    return this.enseignantService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enseignantService.remove(+id);
  }
}
