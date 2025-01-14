const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../db');  // Connexion à la base de données MySQL

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Utilisateur non trouvé');

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Mot de passe incorrect');

    // Créer un token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;
