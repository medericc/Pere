import db from '../../../db/db.js'; // Assurez-vous que db.js utilise un export ESModule
import { verifyUserRole } from '../middleware/auth.js'; // Middleware pour vérifier les rôles

// Fonction pour récupérer tous les articles
export async function GET(req) {
  try {
    const query = `
      SELECT articles.*, users.username AS author_username
      FROM articles
      LEFT JOIN users ON articles.username = users.id
    `;
    const results = await db.query(query);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

// Fonction pour créer un nouvel article
export async function POST(req) {
    try {
      const userRole = req.user?.role || null;
      if (!userRole || !['admin', 'writer'].includes(userRole)) {
        return new Response(JSON.stringify({ message: 'Accès interdit' }), { status: 403 });
      }
  
      const { title, content, username, category_id } = await req.json();
  
      const query = `
        INSERT INTO articles (title, content, username, category_id)
        VALUES (?, ?, ?, ?)
      `;
      const result = await db.query(query, [title, content, username, category_id]);
  
      return new Response(
        JSON.stringify({ message: 'Article créé', articleId: result.insertId }),
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
    }
  }
  

// Fonction pour modifier un article
export async function PUT(req, { params }) {
  try {
    const articleId = params.id;
    const userRole = req.user?.role || null;

    if (!userRole || !['admin', 'writer'].includes(userRole)) {
      return new Response(JSON.stringify({ message: 'Accès interdit' }), { status: 403 });
    }

    const { title, content, category_id } = await req.json();

    const query = `
      UPDATE articles
      SET title = ?, content = ?, category_id = ?
      WHERE id = ? AND (username = ? OR ? = 'admin')
    `;
    const result = await db.query(query, [title, content, category_id, articleId, req.user.id, userRole]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Article non trouvé ou accès interdit' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Article mis à jour' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

// Fonction pour supprimer un article
export async function DELETE(req, { params }) {
  try {
    const articleId = params.id;
    const userRole = req.user?.role || null;

    if (!userRole || !['admin', 'writer'].includes(userRole)) {
      return new Response(JSON.stringify({ message: 'Accès interdit' }), { status: 403 });
    }

    const query = `
      DELETE FROM articles
      WHERE id = ? AND (username = ? OR ? = 'admin')
    `;
    const result = await db.query(query, [articleId, req.user.id, userRole]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Article non trouvé ou accès interdit' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Article supprimé' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}
