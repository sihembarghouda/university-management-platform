const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'ma_cle_jwt_secrete_pour_university_management_2025';

// Example payload for an admin (adjust as needed)
// Usage: node tools/gen-token.js [role] [id]
// Examples:
//   node tools/gen-token.js etudiant 5
//   node tools/gen-token.js enseignant 2
//   node tools/gen-token.js directeur 10
const role = process.argv[2] || 'directeur';
const sub = process.argv[3] ? Number(process.argv[3]) : 1;
const payload = {
  sub,
  email: `${role}${sub}@example.com`,
  role,
  nom: role.charAt(0).toUpperCase() + role.slice(1),
  prenom: 'User',
  type: role
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
