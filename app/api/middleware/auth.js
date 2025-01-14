import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Middleware pour protéger les routes
export function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    // Si le header Authorization est manquant, redirige vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new NextResponse('Token manquant', { status: 401 });
  }

  try {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error('Erreur : Clé secrète JWT non définie');
      return new NextResponse('Erreur serveur', { status: 500 });
    }

    jwt.verify(token, secretKey);

    // Si tout est OK, la requête continue
    return NextResponse.next();
  } catch (err) {
    console.error('Erreur de vérification du token :', err);
    return new NextResponse('Token invalide', { status: 403 });
  }
}
