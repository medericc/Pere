import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../../db/db.js'; // Assurez-vous que `db.js` utilise également `export default`

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) return res.status(404).send('Utilisateur non trouvé');

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Mot de passe incorrect');

    // Créer un token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Erreur interne du serveur');
  }
});

export default router;
