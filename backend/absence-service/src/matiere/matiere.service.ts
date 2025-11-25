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
    console.log(`Vérification si l'enseignant ${enseignantId} enseigne la matière ${matiereId}`);
    
    const matiere = await this.matiereRepo.findOne({ 
      where: { id: matiereId },
      relations: ['enseignants']
    });
    
    if (!matiere) {
      console.log(`Matière ${matiereId} non trouvée`);
      throw new NotFoundException(`Matière #${matiereId} non trouvée`);
    }
    
    console.log(`Matière trouvée: ${matiere.nom}, enseignants:`, matiere.enseignants?.map(e => ({ id: e.id, nom: e.nom })));
    
    const isTeacher = matiere.enseignants?.some((e: any) => Number(e.id) === Number(enseignantId)) || false;
    console.log(`Résultat: ${isTeacher}`);
    
    return isTeacher;
  }
}
