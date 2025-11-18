import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MatiereService } from './matiere.service';
import { CreateMatiereDto } from './dto/create-matiere.dto';
import { UpdateMatiereDto } from './dto/update-matiere.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matiereService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatiereDto) {
    return this.matiereService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matiereService.remove(+id);
  }
}
