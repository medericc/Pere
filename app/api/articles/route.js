const express = require('express');
const db = require('../../../db');
const router = express.Router();

// Middleware pour vérifier les rôles
const checkRole = (roles) => (req, res, next) => {
    if (!req.user) return res.status(401).send('Authentification requise');
    const userRole = req.user.role;
    if (!roles.includes(userRole)) return res.status(403).send('Accès interdit');
    next();
  };
  

// Route pour récupérer tous les articles
router.get('/', (req, res) => {
  db.query('SELECT * FROM articles', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Route pour créer un nouvel article
router.post('/', checkRole(['admin', 'writer']), (req, res) => {
    const { title, content, username, category_id } = req.body;
    db.query(
      'INSERT INTO articles (title, content, username, category_id) VALUES (?, ?, ?, ?)',
      [title, content, username, category_id],
      (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Article créé', articleId: results.insertId });
      }
    );
  });
  

// Route pour modifier un article (uniquement pour l'auteur ou admin)
router.put('/:id', checkRole(['admin', 'writer']), (req, res) => {
  const articleId = req.params.id;
  const { title, content, category_name } = req.body;
  db.query(
    'UPDATE articles SET title = ?, content = ?, category_name = ? WHERE id = ? AND (author = ? OR ? = "admin")',
    [title, content, category_name, articleId, req.user.id, req.user.role],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.affectedRows === 0) return res.status(404).send('Article non trouvé ou accès interdit');
      res.json({ message: 'Article mis à jour' });
    }
  );
});

// Route pour supprimer un article
router.delete('/:id', checkRole(['admin']), (req, res) => {
  const articleId = req.params.id;
  db.query('DELETE FROM articles WHERE id = ? AND (author = ? OR ? = "admin")', [articleId, req.user.id, req.user.role], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.affectedRows === 0) return res.status(404).send('Article non trouvé ou accès interdit');
    res.json({ message: 'Article supprimé' });
  });
});

module.exports = router;
