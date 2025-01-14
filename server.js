const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Importer les routes
const authRoutes = require('./api/auth/route');
const articleRoutes = require('./api/articles/route');

// Middleware
const authenticateToken = require('./api/middleware/auth');

// Middleware pour le corps de la requête
app.use(bodyParser.json());
app.use(cors());

// Routes publiques
app.use('/api/auth', authRoutes);  // Route pour l'authentification

// Routes protégées, avec vérification de token
app.use('/api/articles', authenticateToken, articleRoutes);  // Route pour gérer les articles

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
