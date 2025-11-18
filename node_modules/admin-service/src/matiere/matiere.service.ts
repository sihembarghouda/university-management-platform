import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeepPartial } from 'typeorm';
import { Matiere } from './entities/matiere.entity';
import { CreateMatiereDto } from './dto/create-matiere.dto';
import { UpdateMatiereDto } from './dto/update-matiere.dto';
import { Departement } from '../departement/entities/departement.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Niveau } from '../niveau/entities/niveau.entity';
import { Enseignant } from '../enseignant/enseignant.entity';
import { Classe } from '../classe/entities/classe.entity';

@Injectable()
export class MatiereService {
  constructor(
    @InjectRepository(Matiere) private matiereRepo: Repository<Matiere>,
    @InjectRepository(Departement) private depRepo: Repository<Departement>,
    @InjectRepository(Specialite) private specRepo: Repository<Specialite>,
    @InjectRepository(Niveau) private nivRepo: Repository<Niveau>,
    @InjectRepository(Enseignant) private ensRepo: Repository<Enseignant>,
    @InjectRepository(Classe) private classeRepo: Repository<Classe>,
  ) {}

  async create(dto: CreateMatiereDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    if (!departement) throw new NotFoundException('Département introuvable');

    const specialite = dto.specialiteId
      ? ((await this.specRepo.findOneBy({ id: dto.specialiteId })) ?? undefined)
      : undefined;
    if (dto.specialiteId && !specialite)
      throw new NotFoundException('Spécialité introuvable');

    const niveau = dto.niveauId
      ? ((await this.nivRepo.findOneBy({ id: dto.niveauId })) ?? undefined)
      : undefined;
    if (dto.niveauId && !niveau)
      throw new NotFoundException('Niveau introuvable');

    const classe = dto.classeId
      ? ((await this.classeRepo.findOneBy({ id: dto.classeId })) ?? undefined)
      : undefined;
    if (dto.classeId && !classe)
      throw new NotFoundException('Classe introuvable');

    let enseignants: Enseignant[] = [];
    if (dto.enseignantsIds && dto.enseignantsIds.length) {
      enseignants = await this.ensRepo.findBy({ id: In(dto.enseignantsIds) });
    }

    const matPartial: DeepPartial<Matiere> = {
      nom: dto.nom,
      code: dto.code,
      departement,
      ...(specialite ? { specialite } : {}),
      ...(niveau ? { niveau } : {}),
      ...(classe ? { classe } : {}),
      enseignants,
      description: dto.description,
    };

    const mat = this.matiereRepo.create(matPartial);

    return this.matiereRepo.save(mat);
  }

  findAll() {
    return this.matiereRepo.find();
  }

  findOne(id: number) {
    return this.matiereRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateMatiereDto) {
    const mat = await this.matiereRepo.findOne({ where: { id } });
    if (!mat) throw new NotFoundException('Matière introuvable');

    if (dto.departementId) {
      const dep = await this.depRepo.findOneBy({ id: dto.departementId });
      if (!dep) throw new NotFoundException('Département introuvable');
      mat.departement = dep;
    }
    if (dto.specialiteId) {
      const spec = await this.specRepo.findOneBy({ id: dto.specialiteId });
      if (!spec) throw new NotFoundException('Spécialité introuvable');
      mat.specialite = spec;
    }
    if (dto.niveauId) {
      const niv = await this.nivRepo.findOneBy({ id: dto.niveauId });
      if (!niv) throw new NotFoundException('Niveau introuvable');
      mat.niveau = niv;
    }
    if (dto.classeId) {
      const cls = await this.classeRepo.findOneBy({ id: dto.classeId });
      if (!cls) throw new NotFoundException('Classe introuvable');
      mat.classe = cls;
    }

    if (dto.enseignantsIds) {
      mat.enseignants = await this.ensRepo.findBy({
        id: In(dto.enseignantsIds),
      });
    }

    if (dto.nom !== undefined) mat.nom = dto.nom;
    if (dto.code !== undefined) mat.code = dto.code;
    if (dto.description !== undefined) mat.description = dto.description;

    return this.matiereRepo.save(mat);
  }

  remove(id: number) {
    return this.matiereRepo.delete(id);
  }
}
