import jwt from 'jsonwebtoken';

// Middleware pour protéger les routes
function middleware(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    // Si le header Authorization est manquant, redirige vers la page de connexion
    return {
      redirect: '/login',
    };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { status: 401, message: 'Token manquant' };
  }

  try {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error('Erreur : Clé secrète JWT non définie');
      return { status: 500, message: 'Erreur serveur' };
    }

    jwt.verify(token, secretKey);

    // Si tout est OK, la requête continue
    return { status: 200 };
  } catch (err) {
    console.error('Erreur de vérification du token :', err);
    return { status: 403, message: 'Token invalide' };
  }
}

export default middleware;
