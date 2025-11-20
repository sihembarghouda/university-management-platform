import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matiere } from './entities/matiere.entity';

@Injectable()
export class MatiereService {
  constructor(
    @InjectRepository(Matiere)
    private readonly matiereRepo: Repository<Matiere>,
  ) {}

  async findOneWithEnseignants(id: number): Promise<Matiere> {
    const matiere = await this.matiereRepo.findOne({ where: { id } });
    if (!matiere) throw new NotFoundException(`Matière #${id} non trouvée`);
    return matiere;
  }

  async isTeacherOfMatiere(matiereId: number, enseignantId: number): Promise<boolean> {
    const matiere = await this.matiereRepo.findOne({ where: { id: matiereId } });
    if (!matiere) throw new NotFoundException(`Matière #${matiereId} non trouvée`);
    // 'enseignants' is eager-loaded in the entity, so the relation should be present
    const enseignants = (matiere as any).enseignants || [];
    return enseignants.some((e: any) => Number(e.id) === Number(enseignantId));
  }
}
