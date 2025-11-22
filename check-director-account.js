const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'university_db_2',
  user: 'postgres',
  password: '0000'
});

async function checkDirectorAccount() {
  try {
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Vérifier si le compte existe
    const result = await client.query(
      'SELECT id, email, nom, prenom, role, password IS NOT NULL as has_password, "mustChangePassword" FROM enseignant WHERE email = $1',
      ['haithem@gmail.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Le compte haithem@gmail.com n\'existe PAS dans la table enseignant');
      console.log('\n📝 Pour créer ce compte, vous devez:');
      console.log('1. Vous connecter avec un compte administratif');
      console.log('2. Aller dans la section "Enseignants"');
      console.log('3. Ajouter un nouvel enseignant avec:');
      console.log('   - Email: haithem@gmail.com');
      console.log('   - Rôle: directeur_departement');
      console.log('   - Les autres informations requises');
    } else {
      const account = result.rows[0];
      console.log('\n✅ Compte trouvé!');
      console.log('━'.repeat(50));
      console.log('ID:', account.id);
      console.log('Email:', account.email);
      console.log('Nom:', account.nom);
      console.log('Prénom:', account.prenom);
      console.log('Rôle:', account.role);
      console.log('A un mot de passe:', account.has_password ? 'OUI ✓' : 'NON ✗');
      console.log('Doit changer le mot de passe:', account.mustChangePassword ? 'OUI' : 'NON');
      console.log('━'.repeat(50));

      if (!account.has_password) {
        console.log('\n⚠️  Le compte n\'a PAS de mot de passe défini!');
        console.log('Voulez-vous définir un mot de passe maintenant? (Relancez avec l\'option --set-password)');
      }

      if (account.role !== 'directeur_departement') {
        console.log(`\n⚠️  Le rôle actuel est "${account.role}" au lieu de "directeur_departement"`);
        console.log('Pour changer le rôle, modifiez-le via l\'interface admin ou avec SQL:');
        console.log(`UPDATE enseignant SET role = 'directeur_departement' WHERE email = 'haithem@gmail.com';`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkDirectorAccount();
