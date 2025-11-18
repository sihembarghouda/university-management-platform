import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpecialiteService } from './specialite.service';
import { CreateSpecialiteDto } from './dto/create-specialite.dto';
import { UpdateSpecialiteDto } from './dto/update-specialite.dto';

@Controller('specialite')
export class SpecialiteController {
  constructor(private readonly specialiteService: SpecialiteService) {}

  @Post()
  create(@Body() createSpecialiteDto: CreateSpecialiteDto) {
    return this.specialiteService.create(createSpecialiteDto);
  }

  @Get()
  findAll() {
    return this.specialiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialiteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecialiteDto: UpdateSpecialiteDto,
  ) {
    return this.specialiteService.update(+id, updateSpecialiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialiteService.remove(+id);
  }
}
