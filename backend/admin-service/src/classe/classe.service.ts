import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './entities/classe.entity';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { Niveau } from '../niveau/entities/niveau.entity';

@Injectable()
export class ClasseService {
  constructor(
    @InjectRepository(Classe)
    private repo: Repository<Classe>,
    @InjectRepository(Niveau)
    private niveauRepo: Repository<Niveau>,
  ) {}

  async create(dto: CreateClasseDto) {
    const niveau = await this.niveauRepo.findOneBy({ id: dto.niveauId });
    if (!niveau) throw new NotFoundException('Niveau introuvable');

    const classe = this.repo.create({
      nom: dto.nom,
      niveau,
    });

    return this.repo.save(classe);
  }

  findAll() {
    return this.repo.find({ relations: ['niveau'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['niveau'],
    });
  }

  async update(id: number, dto: UpdateClasseDto) {
    const classe = await this.repo.findOneBy({ id });
    if (!classe) throw new NotFoundException('Classe introuvable');

    if (dto.nom) classe.nom = dto.nom;

    if (dto.niveauId) {
      const niv = await this.niveauRepo.findOneBy({ id: dto.niveauId });
      if (!niv) throw new NotFoundException('Niveau introuvable');
      classe.niveau = niv;
    }

    return this.repo.save(classe);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
