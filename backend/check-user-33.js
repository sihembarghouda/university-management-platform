const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'university_db_2',
  user: 'postgres',
  password: '0000',
});

async function checkUser() {
  try {
    console.log('🔍 Vérification de l\'utilisateur ID 33...\n');
    
    // Vérifier dans la table utilisateur
    const userResult = await pool.query('SELECT id, nom, prenom, email, role FROM utilisateur WHERE id = 33');
    console.log('📋 Utilisateur (table utilisateur):');
    if (userResult.rows.length > 0) {
      console.log(userResult.rows[0]);
    } else {
      console.log('❌ Aucun utilisateur trouvé avec ID 33');
    }
    
    console.log('\n');
    
    // Vérifier dans la table etudiant
    const etudiantResult = await pool.query('SELECT id, nom, prenom, cin, email, "classeId" FROM etudiant WHERE id = 33');
    console.log('🎓 Étudiant (table etudiant):');
    if (etudiantResult.rows.length > 0) {
      console.log(etudiantResult.rows[0]);
    } else {
      console.log('❌ Aucun étudiant trouvé avec ID 33');
    }
    
    console.log('\n');
    
    // Trouver l'étudiant qui correspond à cet utilisateur
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const matchingEtudiant = await pool.query(
        'SELECT id, nom, prenom, cin, email, "classeId" FROM etudiant WHERE email = $1',
        [user.email]
      );
      
      console.log('🔗 Étudiant correspondant à cet email:');
      if (matchingEtudiant.rows.length > 0) {
        console.log(matchingEtudiant.rows[0]);
      } else {
        console.log('❌ Aucun étudiant trouvé avec cet email');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();
