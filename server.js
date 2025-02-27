import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

// Import routes
import authRoutes from './app/api/auth/route.js';


// Initialize Express app
const app = express();

// Use middlewares
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static files
app.use('/public/uploads', express.static('public/uploads'));

// File upload route
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('Requête reçue sur /upload');
  console.log('Fichier :', req.file);
  console.log('Body :', req.body);

  if (!req.file) {
    return res.status(400).send({ message: 'Aucun fichier téléchargé.' });
  }

  res.status(200).send({
    message: 'Fichier téléchargé avec succès.',
    filePath: `/public/uploads/${req.file.filename}`,
  });
});

// Public routes
app.use('/app/api/auth', authRoutes);



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});