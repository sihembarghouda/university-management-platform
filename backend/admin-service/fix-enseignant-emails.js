const { Client } = require('pg');
require('dotenv').config();

async function fixEnseignantEmails() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'university_db',
  });

  try {
    await client.connect();
    console.log('✅ Connexion à la base de données réussie');

    // Étape 1: Compter les enseignants avec email NULL
    const nullEmailCount = await client.query(
      "SELECT COUNT(*) FROM enseignant WHERE email IS NULL OR email = ''"
    );
    console.log(`📊 Nombre d'enseignants avec email NULL: ${nullEmailCount.rows[0].count}`);

    if (parseInt(nullEmailCount.rows[0].count) > 0) {
      // Étape 2: Mettre à jour les emails NULL
      console.log('🔧 Correction des emails NULL...');
      await client.query(`
        UPDATE enseignant 
        SET email = CONCAT(LOWER(REPLACE(nom, ' ', '')), '.', LOWER(REPLACE(prenom, ' ', '')), '@university.edu')
        WHERE email IS NULL OR email = ''
      `);
      console.log('✅ Emails NULL corrigés');
    }

    // Étape 3: Corriger les doublons d'email
    console.log('🔧 Vérification des doublons d\'email...');
    const duplicatesQuery = `
      WITH duplicate_emails AS (
        SELECT id, email, 
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
        FROM enseignant
        WHERE email IS NOT NULL
      )
      SELECT COUNT(*) FROM duplicate_emails WHERE rn > 1
    `;
    
    const duplicateCount = await client.query(duplicatesQuery);
    console.log(`📊 Nombre de doublons d'email: ${duplicateCount.rows[0].count}`);

    if (parseInt(duplicateCount.rows[0].count) > 0) {
      console.log('🔧 Correction des doublons d\'email...');
      await client.query(`
        WITH duplicate_emails AS (
          SELECT id, email, 
                 ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
          FROM enseignant
          WHERE email IS NOT NULL
        )
        UPDATE enseignant 
        SET email = CONCAT(
          SUBSTRING(enseignant.email FROM 1 FOR POSITION('@' IN enseignant.email) - 1),
          de.rn,
          SUBSTRING(enseignant.email FROM POSITION('@' IN enseignant.email))
        )
        FROM duplicate_emails de
        WHERE enseignant.id = de.id 
        AND de.rn > 1
      `);
      console.log('✅ Doublons d\'email corrigés');
    }

    // Étape 4: Vérification finale
    const finalCheck = await client.query(
      "SELECT id, nom, prenom, email FROM enseignant WHERE email IS NULL OR email = '' LIMIT 5"
    );
    
    if (finalCheck.rows.length === 0) {
      console.log('✅ Tous les enseignants ont maintenant un email valide');
    } else {
      console.log('❌ Il reste des enseignants sans email:');
      console.table(finalCheck.rows);
    }

    // Afficher quelques exemples
    const sampleEmails = await client.query(
      "SELECT id, nom, prenom, email FROM enseignant ORDER BY id LIMIT 5"
    );
    console.log('📋 Exemples d\'emails générés:');
    console.table(sampleEmails.rows);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

fixEnseignantEmails();