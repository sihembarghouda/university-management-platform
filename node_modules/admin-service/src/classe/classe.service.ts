import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classe } from './entities/classe.entity';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { Specialite } from '../specialite/entities/specialite.entity';
import { Niveau } from '../niveau/entities/niveau.entity';

@Injectable()
export class ClasseService {
  constructor(
    @InjectRepository(Classe)
    private repo: Repository<Classe>,
    @InjectRepository(Specialite)
    private specialiteRepo: Repository<Specialite>,
    @InjectRepository(Niveau)
    private niveauRepo: Repository<Niveau>,
  ) {}

  async create(dto: CreateClasseDto) {
    const specialite = await this.specialiteRepo.findOne({
      where: { id: dto.specialiteId },
      relations: ['niveau'],
    });
    if (!specialite) throw new NotFoundException('Spécialité introuvable');

    const niveau = await this.niveauRepo.findOneBy({ id: dto.niveauId });
    if (!niveau) throw new NotFoundException('Niveau introuvable');

    // 🔥 Génération automatique du nom de classe
    const nomClasse = await this.genererNomClasse(specialite, niveau);

    const classe = this.repo.create({
      nom: nomClasse,
      niveau,
      specialite,
    });

    return this.repo.save(classe);
  }

  /**
   * Génère automatiquement le nom de la classe selon le format :
   * {CODE_SPECIALITE} {NUMERO_NIVEAU}{COMPTEUR}
   * Exemples: DSI 21, DSI 22, TI 11, GM 31
   */
  private async genererNomClasse(
    specialite: Specialite,
    niveau: Niveau,
  ): Promise<string> {
    // Extraire le code de la spécialité (ex: "DSI", "TI", "GM")
    const codeSpecialite = specialite.nom.split(' ')[0].toUpperCase();

    // Extraire le numéro du niveau (1, 2, 3, etc.)
    const numeroNiveau = this.extraireNumeroNiveau(niveau.nom);

    // Chercher toutes les classes dont le nom commence par le pattern attendu (ex: "TI 1")
    // Pour gérer les données existantes qui peuvent avoir des specialiteId différents
    const pattern = `${codeSpecialite} ${numeroNiveau}%`;
    const classesExistantes = await this.repo
      .createQueryBuilder('classe')
      .where('classe.nom LIKE :pattern', { pattern })
      .getCount();

    // Compteur commence à 1
    const compteur = classesExistantes + 1;

    // Format final: DSI 21, DSI 22, TI 11, etc.
    return `${codeSpecialite} ${numeroNiveau}${compteur}`;
  }

  /**
   * Extrait le numéro du niveau à partir du nom
   * "1ère année" → 1, "2ème année" → 2, "Master 1" → 5, etc.
   */
  private extraireNumeroNiveau(nomNiveau: string): number {
    if (nomNiveau.includes('1ère') || nomNiveau.includes('1')) return 1;
    if (nomNiveau.includes('2ème') || nomNiveau.includes('2')) return 2;
    if (nomNiveau.includes('3ème') || nomNiveau.includes('3')) return 3;
    if (nomNiveau.includes('Master 1') || nomNiveau.includes('M1')) return 5;
    if (nomNiveau.includes('Master 2') || nomNiveau.includes('M2')) return 6;
    return 1; // Par défaut
  }

  async findAll() {
    const classes = await this.repo
      .createQueryBuilder('classe')
      .leftJoinAndSelect('classe.specialite', 'specialite')
      .leftJoinAndSelect('specialite.departement', 'departement')
      .leftJoinAndSelect('classe.niveau', 'niveau')
      .getMany();

    console.log('🔍 [ClasseService] Classes chargées:', classes.length);
    if (classes.length > 0) {
      console.log('🔍 [ClasseService] Première classe:', classes[0]);
      console.log('🔍 [ClasseService] Specialite:', classes[0]?.specialite);
      console.log(
        '🔍 [ClasseService] Departement:',
        classes[0]?.specialite?.departement,
      );
    }

    return classes;
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['specialite', 'specialite.departement', 'specialite.niveau'],
    });
  }

  async update(id: number, dto: UpdateClasseDto) {
    const classe = await this.repo.findOne({
      where: { id },
      relations: ['specialite', 'niveau'],
    });
    if (!classe) throw new NotFoundException('Classe introuvable');

    let nomMisAJour = false;

    if (dto.niveauId) {
      const niveau = await this.niveauRepo.findOneBy({ id: dto.niveauId });
      if (!niveau) throw new NotFoundException('Niveau introuvable');
      classe.niveau = niveau;
      nomMisAJour = true;
    }

    if (dto.specialiteId) {
      const specialite = await this.specialiteRepo.findOne({
        where: { id: dto.specialiteId },
        relations: ['niveau'],
      });
      if (!specialite) throw new NotFoundException('Spécialité introuvable');
      classe.specialite = specialite;
      nomMisAJour = true;
    }

    // Régénérer le nom si niveau ou spécialité changent
    if (nomMisAJour) {
      classe.nom = await this.genererNomClasse(
        classe.specialite,
        classe.niveau,
      );
    }

    return this.repo.save(classe);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
