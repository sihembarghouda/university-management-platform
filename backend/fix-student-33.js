const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'university_db_2',
  user: 'postgres',
  password: '0000',
});

async function fixStudent() {
  try {
    console.log('🔧 Correction de l\'étudiant ID 33...\n');
    
    // Récupérer l'utilisateur
    const userResult = await pool.query('SELECT * FROM utilisateur WHERE id = 33');
    if (userResult.rows.length === 0) {
      console.log('❌ Utilisateur ID 33 non trouvé');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ Utilisateur trouvé:', user.prenom, user.nom);
    
    // Récupérer une classe par défaut (la première disponible)
    const classeResult = await pool.query('SELECT id, nom FROM classe LIMIT 1');
    if (classeResult.rows.length === 0) {
      console.log('❌ Aucune classe disponible');
      return;
    }
    
    const classe = classeResult.rows[0];
    console.log('📚 Classe par défaut:', classe.nom, '(ID:', classe.id + ')');
    
    // Créer l'enregistrement étudiant
    const insertResult = await pool.query(
      `INSERT INTO etudiant (nom, prenom, email, cin, "dateNaissance", "classeId", "mustChangePassword")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        user.nom,
        user.prenom,
        user.email,
        'CIN' + user.id, // CIN générique
        null, // dateNaissance
        classe.id,
        false // mustChangePassword
      ]
    );
    
    console.log('\n✅ Étudiant créé avec ID:', insertResult.rows[0].id);
    console.log('📋 Détails:');
    console.log('   - Nom:', user.nom);
    console.log('   - Prénom:', user.prenom);
    console.log('   - Email:', user.email);
    console.log('   - Classe:', classe.nom);
    
    console.log('\n⚠️  IMPORTANT: L\'ID de l\'étudiant est', insertResult.rows[0].id, 'mais l\'ID utilisateur est 33');
    console.log('   Vous devrez peut-être mettre à jour le token JWT pour utiliser le bon ID');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

fixStudent();
