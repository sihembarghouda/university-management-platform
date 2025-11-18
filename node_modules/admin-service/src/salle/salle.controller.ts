import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SalleService } from './salle.service';
import { CreateSalleDto } from './dto/create-salle.dto';
import { UpdateSalleDto } from './dto/update-salle.dto';

@Controller('salles')
export class SalleController {
  constructor(private readonly salleService: SalleService) {}

  @Post()
  create(@Body() dto: CreateSalleDto) {
    return this.salleService.create(dto);
  }

  @Get()
  findAll() {
    return this.salleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalleDto) {
    return this.salleService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salleService.remove(+id);
  }
}
