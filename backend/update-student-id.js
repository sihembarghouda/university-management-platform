const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'university_db_2',
  user: 'postgres',
  password: '0000',
});

async function updateStudentId() {
  try {
    console.log('🔧 Mise à jour de l\'ID étudiant 24 vers 33...\n');
    
    // Vérifier si l'ID 33 est déjà utilisé dans la table étudiant
    const existingResult = await pool.query('SELECT id FROM etudiant WHERE id = 33');
    if (existingResult.rows.length > 0) {
      console.log('❌ L\'ID 33 est déjà utilisé dans la table étudiant');
      console.log('   Suppression de l\'ancien enregistrement...');
      await pool.query('DELETE FROM etudiant WHERE id = 24');
      console.log('   ✅ Enregistrement ID 24 supprimé (doublon)');
      return;
    }
    
    // Mettre à jour l'ID
    await pool.query('UPDATE etudiant SET id = 33 WHERE id = 24');
    
    // Réinitialiser la séquence pour éviter les conflits futurs
    await pool.query('SELECT setval(\'etudiant_id_seq\', (SELECT MAX(id) FROM etudiant))');
    
    console.log('✅ ID mis à jour avec succès!');
    console.log('   L\'étudiant a maintenant l\'ID 33, ce qui correspond à l\'utilisateur');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

updateStudentId();
