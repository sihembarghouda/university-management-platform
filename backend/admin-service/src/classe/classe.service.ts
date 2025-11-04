import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './entities/classe.entity';
import { Niveau } from './entities/niveau.entity';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClasseService {
  constructor(
    @InjectRepository(Classe)
    private readonly classeRepository: Repository<Classe>,
    @InjectRepository(Niveau)
    private readonly niveauRepository: Repository<Niveau>,
  ) {}

  // Créer une classe
  async create(createClasseDto: CreateClasseDto): Promise<Classe> {
    // Vérifier si le code existe déjà
    const existingCode = await this.classeRepository.findOne({
      where: { code: createClasseDto.code },
    });
    if (existingCode) {
      throw new ConflictException('Une classe avec ce code existe déjà');
    }

    // Vérifier si le nom existe déjà
    const existingNom = await this.classeRepository.findOne({
      where: { nom: createClasseDto.nom },
    });
    if (existingNom) {
      throw new ConflictException('Une classe avec ce nom existe déjà');
    }

    // Vérifier que le niveau existe
    if (createClasseDto.niveau_id) {
      const niveau = await this.niveauRepository.findOne({
        where: { id: createClasseDto.niveau_id },
      });
      if (!niveau) {
        throw new NotFoundException(
          `Niveau avec l'ID ${createClasseDto.niveau_id} introuvable`,
        );
      }
    }

    const classe = this.classeRepository.create(createClasseDto);
    return await this.classeRepository.save(classe);
  }

  // Récupérer toutes les classes
  async findAll(): Promise<Classe[]> {
    return await this.classeRepository.find({
      relations: ['niveau', 'niveau.specialite'],
      order: { nom: 'ASC' },
    });
  }

  // Récupérer une classe par ID
  async findOne(id: number): Promise<Classe> {
    const classe = await this.classeRepository.findOne({
      where: { id },
      relations: ['niveau', 'niveau.specialite'],
    });

    if (!classe) {
      throw new NotFoundException(`Classe avec l'ID ${id} introuvable`);
    }

    return classe;
  }

  // Mettre à jour une classe
  async update(id: number, updateClasseDto: UpdateClasseDto): Promise<Classe> {
    const classe = await this.findOne(id);

    // Vérifier unicité du code
    if (updateClasseDto.code && updateClasseDto.code !== classe.code) {
      const existing = await this.classeRepository.findOne({
        where: { code: updateClasseDto.code },
      });
      if (existing) {
        throw new ConflictException('Une classe avec ce code existe déjà');
      }
    }

    // Vérifier unicité du nom
    if (updateClasseDto.nom && updateClasseDto.nom !== classe.nom) {
      const existing = await this.classeRepository.findOne({
        where: { nom: updateClasseDto.nom },
      });
      if (existing) {
        throw new ConflictException('Une classe avec ce nom existe déjà');
      }
    }

    // Vérifier que le niveau existe
    if (
      updateClasseDto.niveau_id &&
      updateClasseDto.niveau_id !== classe.niveau_id
    ) {
      const niveau = await this.niveauRepository.findOne({
        where: { id: updateClasseDto.niveau_id },
      });
      if (!niveau) {
        throw new NotFoundException(
          `Niveau avec l'ID ${updateClasseDto.niveau_id} introuvable`,
        );
      }
    }

    Object.assign(classe, updateClasseDto);
    return await this.classeRepository.save(classe);
  }

  // Supprimer une classe
  async remove(id: number): Promise<void> {
    const classe = await this.findOne(id);

    // Vérifier s'il y a des étudiants
    if (classe.nombre_etudiants > 0) {
      throw new ConflictException(
        `Impossible de supprimer la classe ${classe.nom} car elle contient ${classe.nombre_etudiants} étudiant(s)`,
      );
    }

    await this.classeRepository.remove(classe);
  }

  // Récupérer toutes les classes d'un niveau
  async findByNiveau(niveauId: number): Promise<Classe[]> {
    return await this.classeRepository.find({
      where: { niveau_id: niveauId },
      relations: ['niveau'],
      order: { nom: 'ASC' },
    });
  }

  // Récupérer tous les niveaux (pour le dropdown)
  async getAllNiveaux(): Promise<Niveau[]> {
    return await this.niveauRepository.find({
      relations: ['specialite'],
      order: { ordre: 'ASC' },
    });
  }
}
