import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importer les routes
import authRoutes from './app/api/auth/route.js';
import articleRoutes from './app/api/articles/route.js';

// Middleware
import authenticateToken from './app/api/middleware/auth.js';

// Initialiser l'application Express
const app = express();

// Utiliser les middlewares
app.use(bodyParser.json()); // Pour traiter les requêtes avec un corps JSON
app.use(cors()); // Pour permettre les requêtes cross-origin

// Routes publiques (sans authentification)
app.use('/app/api/auth', authRoutes);

// Routes protégées par un middleware d'authentification
app.use('/app/api/articles', authenticateToken, articleRoutes);

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});
