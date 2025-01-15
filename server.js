import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importer les routes
import authRoutes from './app/api/auth/route.js';
import articleRoutes from './app/api/articles/route.js';

// Middleware
import authenticateToken from './app/api/middleware/auth.js';

const app = express();

// Middleware pour le corps de la requête
app.use(bodyParser.json());
app.use(cors());

// Routes publiques
app.use('/app/api/auth', authRoutes); // Route pour l'authentification

// Routes protégées, avec vérification de token
app.use('/app/api/articles', authenticateToken, articleRoutes); // Route pour gérer les articles

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
