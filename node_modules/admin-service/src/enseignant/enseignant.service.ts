// src/enseignant/enseignant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Enseignant } from './enseignant.entity';
import { Departement } from '../departement/entities/departement.entity';
import { SpecialiteEnseignement } from './specialite-enseignement.entity';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

@Injectable()
export class EnseignantService {
  constructor(
    @InjectRepository(Enseignant)
    private enseignantRepo: Repository<Enseignant>,
    @InjectRepository(Departement)
    private depRepo: Repository<Departement>,
    @InjectRepository(SpecialiteEnseignement)
    private specEnsRepo: Repository<SpecialiteEnseignement>,
  ) {}

  async create(dto: CreateEnseignantDto) {
    const departement = await this.depRepo.findOneBy({ id: dto.departementId });
    if (!departement) throw new NotFoundException('Département introuvable');

    const specialiteEnseignement = await this.specEnsRepo.findOneBy({
      id: dto.specialiteEnseignementId,
    });
    if (!specialiteEnseignement)
      throw new NotFoundException("Spécialité d'enseignement introuvable");

    // Vérifier qu'il n'y a pas déjà un directeur pour ce département
    if (dto.role === 'directeur_departement') {
      const existingDirecteur = await this.enseignantRepo.findOne({
        where: {
          departement: { id: dto.departementId },
          role: 'directeur_departement',
        },
      });

      if (existingDirecteur) {
        throw new NotFoundException(
          `Un directeur existe déjà pour ce département (${existingDirecteur.nom} ${existingDirecteur.prenom}). Un seul directeur par département est autorisé.`,
        );
      }
    }

    // Générer le mot de passe haché à partir du CIN
    const hashedPassword = dto.cin ? await bcrypt.hash(dto.cin, 10) : undefined;

    const enseignant = this.enseignantRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      cin: dto.cin,
      telephone: dto.telephone,
      password: hashedPassword,
      mustChangePassword: true,
      role: dto.role || 'enseignant',
      grade: dto.grade,
      departement,
      specialiteEnseignement,
    });

    return this.enseignantRepo.save(enseignant);
  }

  findAll() {
    return this.enseignantRepo.find({
      relations: ['departement', 'specialiteEnseignement'],
    });
  }

  async findOne(id: number) {
    const enseignant = await this.enseignantRepo.findOne({
      where: { id },
      relations: ['departement', 'specialiteEnseignement'],
    });
    if (!enseignant) throw new NotFoundException('Enseignant non trouvé');
    return enseignant;
  }

  async update(id: number, dto: UpdateEnseignantDto) {
    const enseignant = await this.findOne(id);

    if (dto.departementId) {
      const departement = await this.depRepo.findOneBy({
        id: dto.departementId,
      });
      if (!departement) throw new NotFoundException('Département introuvable');
      enseignant.departement = departement;
    }

    if (dto.specialiteEnseignementId) {
      const specialiteEnseignement = await this.specEnsRepo.findOneBy({
        id: dto.specialiteEnseignementId,
      });
      if (!specialiteEnseignement)
        throw new NotFoundException("Spécialité d'enseignement introuvable");
      enseignant.specialiteEnseignement = specialiteEnseignement;
    }

    // Vérifier si on change le rôle vers directeur_departement
    if (dto.role === 'directeur_departement') {
      const targetDeptId = dto.departementId || enseignant.departement?.id;

      // Chercher un directeur existant dans le département cible (sauf l'enseignant actuel)
      const existingDirecteur = await this.enseignantRepo.findOne({
        where: {
          departement: { id: targetDeptId },
          role: 'directeur_departement',
        },
      });

      if (existingDirecteur && existingDirecteur.id !== id) {
        throw new NotFoundException(
          `Un directeur existe déjà pour ce département (${existingDirecteur.nom} ${existingDirecteur.prenom}). Un seul directeur par département est autorisé.`,
        );
      }
    }

    if (dto.nom !== undefined) enseignant.nom = dto.nom;
    if (dto.prenom !== undefined) enseignant.prenom = dto.prenom;
    if (dto.email !== undefined) enseignant.email = dto.email;
    if (dto.cin !== undefined) enseignant.cin = dto.cin;
    if (dto.telephone !== undefined) enseignant.telephone = dto.telephone;
    if (dto.grade !== undefined) enseignant.grade = dto.grade;
    if (dto.role !== undefined) enseignant.role = dto.role;

    return this.enseignantRepo.save(enseignant);
  }

  async remove(id: number) {
    const enseignant = await this.findOne(id);
    await this.enseignantRepo.remove(enseignant);
    return { message: 'Enseignant supprimé avec succès' };
  }
}
