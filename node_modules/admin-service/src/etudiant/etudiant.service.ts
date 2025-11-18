import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Etudiant } from './entities/etudiant.entity';
import { Classe } from '../classe/entities/classe.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private etudiantRepo: Repository<Etudiant>,
    @InjectRepository(Classe)
    private classeRepo: Repository<Classe>,
  ) {}

  async create(dto: CreateEtudiantDto) {
    const classe = await this.classeRepo.findOne({
      where: { id: dto.classeId },
    });
    if (!classe) throw new NotFoundException('Classe non trouvée');

    // Générer le mot de passe haché à partir du CIN
    const hashedPassword = dto.cin ? await bcrypt.hash(dto.cin, 10) : undefined;

    const etu = this.etudiantRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      cin: dto.cin,
      password: hashedPassword,
      mustChangePassword: true,
      classe,
    });
    return this.etudiantRepo.save(etu);
  }

  async findAll() {
    return this.etudiantRepo.find({ relations: ['classe'] });
  }

  async findOne(id: number) {
    const etudiant = await this.etudiantRepo.findOne({
      where: { id },
      relations: ['classe'],
    });
    if (!etudiant) throw new NotFoundException('Étudiant non trouvé');
    return etudiant;
  }

  async update(id: number, dto: UpdateEtudiantDto) {
    const etudiant = await this.findOne(id);

    if (dto.classeId) {
      const classe = await this.classeRepo.findOne({
        where: { id: dto.classeId },
      });
      if (!classe) throw new NotFoundException('Classe non trouvée');
      etudiant.classe = classe;
    }

    if (dto.nom !== undefined) etudiant.nom = dto.nom;
    if (dto.prenom !== undefined) etudiant.prenom = dto.prenom;
    if (dto.email !== undefined) etudiant.email = dto.email;
    if (dto.cin !== undefined) etudiant.cin = dto.cin;

    return this.etudiantRepo.save(etudiant);
  }

  async remove(id: number) {
    const etudiant = await this.findOne(id);
    await this.etudiantRepo.remove(etudiant);
    return { message: 'Étudiant supprimé avec succès' };
  }
}
