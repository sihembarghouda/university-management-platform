import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Niveau } from './entities/niveau.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';

@Injectable()
export class NiveauService {
  constructor(
    @InjectRepository(Niveau)
    private readonly niveauRepository: Repository<Niveau>,

    @InjectRepository(Specialite)
    private readonly specialiteRepository: Repository<Specialite>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateNiveauDto): Promise<Niveau> {
    const niveau = this.niveauRepository.create({
      nom: dto.nom,
    });

    return this.niveauRepository.save(niveau);
  }

  // ✅ FIND ALL
  async findAll(): Promise<Niveau[]> {
    return this.niveauRepository.find({
      relations: ['specialites', 'specialites.departement'],
    });
  }

  // ✅ FIND ONE
  async findOne(id: number): Promise<Niveau> {
    const niveau = await this.niveauRepository.findOne({
      where: { id },
      relations: ['specialites', 'specialites.departement'],
    });
    if (!niveau) throw new NotFoundException(`Niveau ${id} introuvable`);
    return niveau;
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateNiveauDto): Promise<Niveau> {
    const niveau = await this.niveauRepository.findOneBy({ id });
    if (!niveau) throw new NotFoundException(`Niveau ${id} introuvable`);

    if (dto.nom) niveau.nom = dto.nom;

    return this.niveauRepository.save(niveau);
  }

  // ✅ DELETE
  async remove(id: number): Promise<void> {
    const result = await this.niveauRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Niveau ${id} introuvable`);
  }
}
