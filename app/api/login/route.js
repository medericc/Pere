import bcrypt from 'bcrypt';
import db from '../../../db/db.js'; // Assurez-vous que db.js utilise un export ESModule

// Fonction pour gérer la requête POST (création d'un utilisateur)
export async function POST(req) {
  try {
    console.log("Requête POST reçue");
    
    const body = await req.json();
    console.log("Corps de la requête:", body); // Affiche les données envoyées
    
    const { username, email, password } = body;

    if (!username || !email || !password) {
      console.error("Champs requis manquants:", { username, email, password });
      return new Response(JSON.stringify({ message: 'Champs requis manquants' }), { status: 400 });
    }

    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log("Utilisateur existant trouvé:", existingUser);
    
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email déjà utilisé' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Mot de passe haché:", hashedPassword);

    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    console.log("Utilisateur créé, ID:", result.insertId);

    return new Response(
      JSON.stringify({ message: 'Utilisateur créé avec succès', userId: result.insertId }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur:", error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

// Fonction pour gérer la requête GET (récupération des utilisateurs)
// Fonction pour gérer la requête GET (récupération d'un utilisateur par email/username et mot de passe)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('identifier');
    const password = searchParams.get('password');

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ message: 'Identifiant et mot de passe requis' }),
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur par email ou username
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const [rows] = await db.query(query, [identifier, identifier]);
    
    // Vérifie si nous avons des résultats
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Utilisateur non trouvé' }),
        { status: 404 }
      );
    }

    const user = rows[0];

    // Vérifie si le mot de passe existe dans l'objet user
    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ message: 'Données utilisateur invalides' }),
        { status: 500 }
      );
    }

    // Vérifie le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ message: 'Mot de passe incorrect' }),
        { status: 401 }
      );
    }

    // Retire le mot de passe de la réponse
    const { password: _, ...userSansMotDePasse } = user;

    return new Response(
      JSON.stringify(userSansMotDePasse),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    console.error("Erreur de connexion:", error);
    return new Response(
      JSON.stringify({ message: 'Erreur serveur lors de la connexion' }),
      { status: 500 }
    );
  }
}