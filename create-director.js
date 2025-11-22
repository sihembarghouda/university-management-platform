const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'university_db_2',
  user: 'postgres',
  password: '0000'
});

async function createDirector() {
  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // 1. Vérifier/Créer le département Informatique
    let deptResult = await client.query(
      'SELECT id FROM departement WHERE LOWER(nom) LIKE $1 LIMIT 1',
      ['%informatique%']
    );

    let departementId;
    if (deptResult.rows.length === 0) {
      console.log('📝 Création du département Informatique...');
      const newDept = await client.query(
        'INSERT INTO departement (nom) VALUES ($1) RETURNING id',
        ['Informatique']
      );
      departementId = newDept.rows[0].id;
      console.log('✅ Département créé avec ID:', departementId);
    } else {
      departementId = deptResult.rows[0].id;
      console.log('✅ Département Informatique trouvé, ID:', departementId);
    }

    // 2. Vérifier si l'email existe déjà
    const existing = await client.query(
      'SELECT id FROM enseignant WHERE email = $1',
      ['haithem@gmail.com']
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Un compte avec cet email existe déjà!');
      return;
    }

    // 3. Hasher le mot de passe
    const password = '12345678';
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Mot de passe hashé');

    // 4. Créer le compte enseignant avec rôle directeur
    const result = await client.query(
      `INSERT INTO enseignant (
        email, 
        nom, 
        prenom, 
        password, 
        role, 
        "departementId",
        "mustChangePassword"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, email, nom, prenom, role`,
      [
        'haithem@gmail.com',
        'Hafsi',
        'Haithem',
        hashedPassword,
        'directeur_departement',
        departementId,
        false
      ]
    );

    console.log('\n🎉 Compte directeur créé avec succès!');
    console.log('━'.repeat(50));
    console.log('ID:', result.rows[0].id);
    console.log('Email:', result.rows[0].email);
    console.log('Nom:', result.rows[0].nom);
    console.log('Prénom:', result.rows[0].prenom);
    console.log('Rôle:', result.rows[0].role);
    console.log('Mot de passe:', password);
    console.log('Département ID:', departementId);
    console.log('━'.repeat(50));
    console.log('\n✅ Vous pouvez maintenant vous connecter avec:');
    console.log('   Email: haithem@gmail.com');
    console.log('   Mot de passe: 12345678');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

createDirector();
