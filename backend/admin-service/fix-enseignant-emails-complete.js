const { Client } = require('pg');
require('dotenv').config();

async function fixEnseignantEmailsStep() {
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

    // Étape 1: Vérifier si la colonne email existe
    const emailColumnExists = await client.query(`
      SELECT COUNT(*) 
      FROM information_schema.columns 
      WHERE table_name = 'enseignant' 
      AND column_name = 'email'
    `);
    
    console.log(`📊 Colonne email existe: ${emailColumnExists.rows[0].count > 0 ? 'Oui' : 'Non'}`);

    if (emailColumnExists.rows[0].count == 0) {
      // Ajouter la colonne comme nullable d'abord
      console.log('🔧 Ajout de la colonne email (nullable)...');
      await client.query(`
        ALTER TABLE enseignant 
        ADD COLUMN email character varying NULL
      `);
      console.log('✅ Colonne email ajoutée');
    }

    // Étape 2: Vérifier combien d'enseignants ont un email NULL ou vide
    const nullEmailCount = await client.query(`
      SELECT COUNT(*) FROM enseignant WHERE email IS NULL OR email = ''
    `);
    console.log(`📊 Enseignants sans email: ${nullEmailCount.rows[0].count}`);

    // Étape 3: Générer des emails pour ceux qui n'en ont pas
    if (parseInt(nullEmailCount.rows[0].count) > 0) {
      console.log('🔧 Génération des emails manquants...');
      await client.query(`
        UPDATE enseignant 
        SET email = CONCAT(
          LOWER(REPLACE(COALESCE(nom, 'user'), ' ', '')), 
          '.', 
          LOWER(REPLACE(COALESCE(prenom, 'unknown'), ' ', '')), 
          '@university.edu'
        )
        WHERE email IS NULL OR email = ''
      `);
      console.log('✅ Emails générés');
    }

    // Étape 4: Corriger les doublons potentiels
    console.log('🔧 Correction des doublons d\'email...');
    await client.query(`
      WITH numbered_emails AS (
        SELECT id, email, 
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
        FROM enseignant
      )
      UPDATE enseignant 
      SET email = CONCAT(
        SUBSTRING(enseignant.email FROM 1 FOR POSITION('@' IN enseignant.email) - 1),
        ne.rn,
        SUBSTRING(enseignant.email FROM POSITION('@' IN enseignant.email))
      )
      FROM numbered_emails ne
      WHERE enseignant.id = ne.id AND ne.rn > 1
    `);

    // Étape 5: Ajouter la contrainte UNIQUE si elle n'existe pas
    console.log('🔧 Ajout de la contrainte UNIQUE sur email...');
    try {
      await client.query(`
        ALTER TABLE enseignant 
        ADD CONSTRAINT UK_enseignant_email UNIQUE (email)
      `);
      console.log('✅ Contrainte UNIQUE ajoutée');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ Contrainte UNIQUE déjà existante');
      } else {
        console.log('⚠️ Erreur contrainte UNIQUE:', error.message);
      }
    }

    // Étape 6: Rendre la colonne NOT NULL
    console.log('🔧 Modification de la colonne email en NOT NULL...');
    try {
      await client.query(`
        ALTER TABLE enseignant 
        ALTER COLUMN email SET NOT NULL
      `);
      console.log('✅ Colonne email maintenant NOT NULL');
    } catch (error) {
      console.log('⚠️ Erreur NOT NULL:', error.message);
    }

    // Vérification finale
    const finalCheck = await client.query(`
      SELECT COUNT(*) as total, 
             COUNT(email) as with_email,
             COUNT(DISTINCT email) as unique_emails
      FROM enseignant
    `);
    
    const stats = finalCheck.rows[0];
    console.log('\n📊 Statistiques finales:');
    console.log(`   - Total enseignants: ${stats.total}`);
    console.log(`   - Avec email: ${stats.with_email}`);
    console.log(`   - Emails uniques: ${stats.unique_emails}`);

    // Afficher quelques exemples
    const sampleEmails = await client.query(`
      SELECT id, nom, prenom, email 
      FROM enseignant 
      ORDER BY id 
      LIMIT 5
    `);
    console.log('\n📋 Exemples d\'emails:');
    console.table(sampleEmails.rows);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

fixEnseignantEmailsStep();