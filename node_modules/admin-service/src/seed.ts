import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DepartementService } from './departement/departement.service';
import { SpecialiteService } from './specialite/specialite.service';
import { NiveauService } from './niveau/niveau.service';
import { ClasseService } from './classe/classe.service';
import { EnseignantService } from './enseignant/enseignant.service';
import { EtudiantService } from './etudiant/etudiant.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const departementService = app.get(DepartementService);
  const specialiteService = app.get(SpecialiteService);
  const niveauService = app.get(NiveauService);
  const classeService = app.get(ClasseService);
  const enseignantService = app.get(EnseignantService);
  const etudiantService = app.get(EtudiantService);

  console.log('🌱 Début du seed...\n');

  try {
    // 1. Créer des départements
    console.log('📁 Création des départements...');
    const dept1 = await departementService.create({
      nom: 'Informatique',
      code: 'INFO',
    });
    const dept2 = await departementService.create({
      nom: 'Mathématiques',
      code: 'MATH',
    });
    const dept3 = await departementService.create({
      nom: 'Physique',
      code: 'PHY',
    });
    console.log('✅ 3 départements créés\n');

    // 2. Créer des spécialités
    console.log('🎯 Création des spécialités...');
    const spec1 = await specialiteService.create({
      nom: 'Développement Web',
      departementId: dept1.id,
    });
    const spec2 = await specialiteService.create({
      nom: 'Intelligence Artificielle',
      departementId: dept1.id,
    });
    const spec3 = await specialiteService.create({
      nom: 'Mathématiques Appliquées',
      departementId: dept2.id,
    });
    const spec4 = await specialiteService.create({
      nom: 'Physique Nucléaire',
      departementId: dept3.id,
    });
    console.log('✅ 4 spécialités créées\n');

    // 3. Créer des niveaux (indépendants des spécialités)
    console.log('📊 Création des niveaux...');
    const niveau1 = await niveauService.create({
      nom: 'Licence 1',
    });
    const niveau2 = await niveauService.create({
      nom: 'Licence 2',
    });
    const niveau3 = await niveauService.create({
      nom: 'Licence 3',
    });
    const niveau4 = await niveauService.create({
      nom: 'Master 1',
    });
    const niveau5 = await niveauService.create({
      nom: 'Master 2',
    });
    console.log('✅ 5 niveaux créés\n');

    // 4. Créer des classes (liées aux spécialités et niveaux)
    // ❌ nom retiré - généré automatiquement à partir de niveau + spécialité
    console.log('🏫 Création des classes...');
    const classe1 = await classeService.create({
      niveauId: niveau1.id, // 1ère année
      specialiteId: spec1.id, // Développement Logiciel → "DEV 11"
    });
    const classe2 = await classeService.create({
      niveauId: niveau1.id, // 1ère année
      specialiteId: spec1.id, // Développement Logiciel → "DEV 12"
    });
    const classe3 = await classeService.create({
      niveauId: niveau2.id, // 2ème année
      specialiteId: spec1.id, // Développement Logiciel → "DEV 21"
    });
    const classe4 = await classeService.create({
      niveauId: niveau3.id, // 3ème année
      specialiteId: spec1.id, // Développement Logiciel → "DEV 31"
    });
    const classe5 = await classeService.create({
      niveauId: niveau4.id, // Master 1
      specialiteId: spec2.id, // Intelligence Artificielle → "IA 51"
    });
    const classe6 = await classeService.create({
      niveauId: niveau1.id, // 1ère année
      specialiteId: spec3.id, // Mathématiques → "MATHÉMATIQUES 11"
    });
    console.log('✅ 6 classes créées avec noms auto-générés\n');

    // 5. Créer des spécialités d'enseignement (pour les enseignants)
    console.log("� Création des spécialités d'enseignement...");
    const specEns1 = { id: 1 }; // Programmation (supposons qu'elle existe avec id=1)
    const specEns2 = { id: 7 }; // Sécurité informatique (id=7)
    const specEns3 = { id: 23 }; // Mathématiques (id=23)
    console.log("✅ Utilisation des spécialités d'enseignement existantes\n");

    // 6. Créer des enseignants
    console.log('�👨‍🏫 Création des enseignants...');
    const ens1 = await enseignantService.create({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@university.com',
      grade: 'Professeur',
      departementId: dept1.id,
      specialiteEnseignementId: specEns1.id, // Programmation
    });
    const ens2 = await enseignantService.create({
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@university.com',
      grade: 'Maître de Conférences',
      departementId: dept1.id,
      specialiteEnseignementId: specEns2.id, // Sécurité informatique
    });
    const ens3 = await enseignantService.create({
      nom: 'Bernard',
      prenom: 'Pierre',
      email: 'pierre.bernard@university.com',
      grade: 'Professeur',
      departementId: dept2.id,
      specialiteEnseignementId: specEns3.id, // Mathématiques
    });
    console.log('✅ 3 enseignants créés\n');

    // 7. Créer des étudiants
    console.log('🎓 Création des étudiants...');
    await etudiantService.create({
      nom: 'Durand',
      prenom: 'Alice',
      email: 'alice.durand@student.com',
      cin: '12345678',
      classeId: classe1.id,
    });
    await etudiantService.create({
      nom: 'Petit',
      prenom: 'Lucas',
      email: 'lucas.petit@student.com',
      cin: '23456789',
      classeId: classe1.id,
    });
    await etudiantService.create({
      nom: 'Robert',
      prenom: 'Emma',
      email: 'emma.robert@student.com',
      cin: '34567890',
      classeId: classe2.id,
    });
    await etudiantService.create({
      nom: 'Richard',
      prenom: 'Thomas',
      email: 'thomas.richard@student.com',
      cin: '45678901',
      classeId: classe3.id,
    });
    await etudiantService.create({
      nom: 'Moreau',
      prenom: 'Marie',
      email: 'marie.moreau@student.com',
      cin: '56789012',
      classeId: classe4.id,
    });
    await etudiantService.create({
      nom: 'Simon',
      prenom: 'Hugo',
      email: 'hugo.simon@student.com',
      cin: '67890123',
      classeId: classe5.id,
    });
    await etudiantService.create({
      nom: 'Laurent',
      prenom: 'Léa',
      email: 'lea.laurent@student.com',
      cin: '78901234',
      classeId: classe6.id,
    });
    await etudiantService.create({
      nom: 'Lefebvre',
      prenom: 'Nathan',
      email: 'nathan.lefebvre@student.com',
      cin: '89012345',
      classeId: classe1.id,
    });
    console.log('✅ 8 étudiants créés\n');

    console.log('🎉 Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log('- 3 Départements');
    console.log('- 4 Spécialités');
    console.log('- 5 Niveaux');
    console.log('- 6 Classes');
    console.log('- 3 Enseignants');
    console.log('- 8 Étudiants');
    console.log('\n✅ Vous pouvez maintenant tester le dashboard !');
  } catch (error) {
    console.error('❌ Erreur pendant le seed:', error.message);
  } finally {
    await app.close();
  }
}

seed();
