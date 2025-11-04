import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClasseService } from './classe.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { Classe } from './entities/classe.entity';

@ApiTags('Classes')
@Controller('classe')
export class ClasseController {
  constructor(private readonly classeService: ClasseService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle classe' })
  @ApiResponse({
    status: 201,
    description: 'Classe créée avec succès',
    type: Classe,
  })
  @ApiResponse({ status: 409, description: 'Classe déjà existante' })
  create(@Body() createClasseDto: CreateClasseDto) {
    return this.classeService.create(createClasseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les classes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des classes',
    type: [Classe],
  })
  findAll() {
    return this.classeService.findAll();
  }

  @Get('niveaux')
  @ApiOperation({ summary: 'Récupérer tous les niveaux' })
  getAllNiveaux() {
    return this.classeService.getAllNiveaux();
  }

  @Get('niveau/:niveauId')
  @ApiOperation({ summary: "Récupérer les classes d'un niveau" })
  findByNiveau(@Param('niveauId') niveauId: string) {
    return this.classeService.findByNiveau(+niveauId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une classe par ID' })
  @ApiResponse({ status: 200, description: 'Classe trouvée', type: Classe })
  @ApiResponse({ status: 404, description: 'Classe introuvable' })
  findOne(@Param('id') id: string) {
    return this.classeService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une classe' })
  @ApiResponse({ status: 200, description: 'Classe mise à jour', type: Classe })
  @ApiResponse({ status: 404, description: 'Classe introuvable' })
  update(@Param('id') id: string, @Body() updateClasseDto: UpdateClasseDto) {
    return this.classeService.update(+id, updateClasseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une classe' })
  @ApiResponse({ status: 200, description: 'Classe supprimée' })
  @ApiResponse({ status: 404, description: 'Classe introuvable' })
  @ApiResponse({ status: 409, description: 'Classe contient des étudiants' })
  remove(@Param('id') id: string) {
    return this.classeService.remove(+id);
  }
}
