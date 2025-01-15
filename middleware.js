import { NextResponse } from 'next/server';

// Middleware global
export function middleware(request) {
  const url = request.url;

  // Si l'utilisateur est déjà sur la page de connexion, ne pas rediriger
  if (url.includes('/login')) {
    return NextResponse.next();  // Pas de redirection si on est déjà sur la page /login
  }

  // Exemple : appliquer un middleware global pour certaines routes (ex: admin)
  if (url.includes('/admin')) {
    // Protection spécifique aux pages admin
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Pour toutes les autres requêtes, continuer normalement
  return NextResponse.next();
}
