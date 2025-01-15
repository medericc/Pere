const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../../db'); // Connexion à la base de données MySQL

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Tous les champs sont obligatoires');
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length > 0) {
        return res.status(400).send('Cet email est déjà utilisé');
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      db.query(
        'INSERT INTO users (username, email, password, created_at, role) VALUES (?, ?, ?, NOW(), ?)',
        [username, email, hashedPassword, 'user'], // Rôle par défaut : "user"
        (err, result) => {
          if (err) return res.status(500).send(err);
          res.status(201).send('Utilisateur créé avec succès');
        }
      );
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
