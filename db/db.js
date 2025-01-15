import mysql from 'mysql2/promise'; // Importation avec le sous-module promise

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Remplace par ton utilisateur MySQL
  password: '', // Remplace par ton mot de passe MySQL
  database: 'paroisse',
});

export default db;
