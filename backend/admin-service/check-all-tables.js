const { Client } = require('pg');
require('dotenv').config();

async function checkAllTables() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'university_db',
  });

  try {
    await client.connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Liste des tables à vérifier
    const tables = ['enseignant', 'matiere', 'departement', 'specialite', 'niveau', 'classe', 'salle', 'etudiant'];

    for (const table of tables) {
      console.log(`🔍 Vérification de la table: ${table}`);
      
      try {
        // Vérifier si la table existe
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [table]);

        if (!tableExists.rows[0].exists) {
          console.log(`   ❌ Table ${table} n'existe pas`);
          continue;
        }

        // Compter les enregistrements
        const count = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`   📊 Nombre d'enregistrements: ${count.rows[0].count}`);

        // Vérifier les colonnes avec contraintes NOT NULL
        const nullConstraints = await client.query(`
          SELECT column_name, is_nullable, data_type
          FROM information_schema.columns 
          WHERE table_name = $1 
          AND is_nullable = 'NO'
          AND column_default IS NULL
        `, [table]);

        if (nullConstraints.rows.length > 0) {
          console.log(`   🔍 Colonnes NOT NULL sans défaut:`);
          for (const col of nullConstraints.rows) {
            // Vérifier s'il y a des valeurs NULL dans ces colonnes
            try {
              const nullCount = await client.query(`
                SELECT COUNT(*) FROM ${table} WHERE ${col.column_name} IS NULL
              `);
              if (parseInt(nullCount.rows[0].count) > 0) {
                console.log(`     ⚠️ ${col.column_name} (${col.data_type}): ${nullCount.rows[0].count} valeurs NULL`);
              } else {
                console.log(`     ✅ ${col.column_name} (${col.data_type}): OK`);
              }
            } catch (error) {
              console.log(`     ❓ ${col.column_name}: erreur de vérification`);
            }
          }
        }

        console.log('');
      } catch (error) {
        console.log(`   ❌ Erreur avec ${table}: ${error.message}\n`);
      }
    }

    // Vérifier les contraintes foreign key manquantes
    console.log('🔍 Vérification des relations manquantes...');
    
    const missingFKs = await client.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `);

    if (missingFKs.rows.length > 0) {
      console.log('📋 Relations Foreign Key actives:');
      console.table(missingFKs.rows);
    } else {
      console.log('❌ Aucune relation Foreign Key trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await client.end();
  }
}

checkAllTables();