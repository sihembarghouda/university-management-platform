const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'university_db',
  user: 'postgres',
  password: '123456789',
});

async function checkNotificationsTable() {
  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Vérifier si la table notifications existe
    const tableQuery = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications'`;
    const tableResult = await client.query(tableQuery);

    if (tableResult.rows.length > 0) {
      console.log('✅ Table notifications existe');

      // Vérifier la structure
      const columnsQuery = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notifications' ORDER BY ordinal_position`;
      const columns = await client.query(columnsQuery);
      console.log('Colonnes de la table notifications:');
      columns.rows.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`));
    } else {
      console.log('❌ Table notifications n\'existe pas');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkNotificationsTable();