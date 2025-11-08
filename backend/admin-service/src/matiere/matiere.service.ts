import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Matiere } from './entities/matiere.entity';
import { CreateMatiereDto } from './dto/create-matiere.dto';
import { Departement } from '../departement/entities/departement.entity';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Niveau } from '../niveau/entities/niveau.entity';
import { Enseignant } from '../enseignant/enseignant.entity';

@Injectable()
export class MatiereService {
  constructor(
    @InjectRepository(Matiere)
    private readonly matiereRepo: Repository<Matiere>,

    @InjectRepository(Departement)
    private readonly depRepo: Repository<Departement>,

    @InjectRepository(Specialite)
    private readonly specRepo: Repository<Specialite>,

    @InjectRepository(Niveau)
    private readonly nivRepo: Repository<Niveau>,

    @InjectRepository(Enseignant)
    private readonly ensRepo: Repository<Enseignant>,
  ) {}

  async create(dto: CreateMatiereDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    const specialite = await this.specRepo.findOneBy({ id: dto.specialiteId });
    const niveau = await this.nivRepo.findOneBy({ id: dto.niveauId });

    const enseignants = dto.enseignantsIds?.length
      ? await this.ensRepo.findBy({ id: In(dto.enseignantsIds) })
      : [];

    const matiere = this.matiereRepo.create({
      nom: dto.nom,
      code: dto.code,
      departement,
      specialite,
      niveau,
      enseignants,
    } as Partial<Matiere>); // 👈 ajout clé ici

    return await this.matiereRepo.save(matiere);
  }

  findAll() {
    return this.matiereRepo.find({
      relations: ['departement', 'specialite', 'niveau', 'enseignants'],
    });
  }
}
