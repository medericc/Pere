import express from 'express';
import db from '../../../db/db.js';
const router = express.Router();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  try {
    let query, params;
    if (id) {
      query = `
        SELECT articles.*, users.username AS author_username
        FROM articles
        LEFT JOIN users ON articles.username = users.username
        WHERE articles.id = ?
      `;
      params = [id];
    } else {
      query = `
        SELECT articles.*, users.username AS author_username
        FROM articles
        LEFT JOIN users ON articles.username = users.username
        ORDER BY articles.published_at DESC
      `;
      params = [];
    }
    const [results] = await db.query(query, params);
    
    return new Response(JSON.stringify(id ? results[0] : results), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Erreur récupération article' }), { status: 500 });
  }
}


  
  
// Fonction pour créer un nouvel article
// Fonction pour créer un nouvel article
export async function POST(req) {
    try {
      const body = await req.json();
      const { title, content, category, thumbnail, author_username } = body;
  
      if (!title || !content || !author_username) {
        return new Response(
          JSON.stringify({ message: 'Titre, contenu et auteur sont requis' }), 
          { status: 400 }
        );
      }
  
      // Ici, pas besoin de récupérer l'ID de l'utilisateur à partir du username,
      // vous allez simplement utiliser l'username tel quel.
  
      const query = `
        INSERT INTO articles (title, content, category_id, image_path, username)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.query(query, [
        title,
        content,
        category || null,
        thumbnail || null,
        author_username // Utilisation du username directement
      ]);
  
      // Récupérer l'article créé avec les informations de l'auteur
      const [newArticle] = await db.query(`
        SELECT articles.*, users.username AS author_username
        FROM articles
        LEFT JOIN users ON articles.username = users.username
        WHERE articles.id = ?
      `, [result.insertId]);
  
      return new Response(
        JSON.stringify(newArticle),
        { 
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Erreur création article:', error);
      return new Response(
        JSON.stringify({ message: 'Erreur lors de la création de l\'article' }), 
        { status: 500 }
      );
    }
  }
  

// Fonction pour modifier un article
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID de l\'article requis' }), 
        { status: 400 }
      );
    }

    const { title, content, category, thumbnail } = await req.json();

    const query = `
      UPDATE articles 
      SET title = ?, content = ?, category_id = ?, image_path = ?
      WHERE id = ?
    `;
    
    await db.query(query, [title, content, category, thumbnail, id]);

    // Récupérer l'article mis à jour
    const [updatedArticle] = await db.query(`
      SELECT articles.*, users.username AS author_username
      FROM articles
     LEFT JOIN users ON articles.username = users.username
      WHERE articles.id = ?
    `, [id]);

    return new Response(
      JSON.stringify(updatedArticle),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur modification article:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la modification de l\'article' }), 
      { status: 500 }
    );
  }
}

// Fonction pour supprimer un article
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID de l\'article requis' }), 
        { status: 400 }
      );
    }

    await db.query('DELETE FROM articles WHERE id = ?', [id]);

    return new Response(
      JSON.stringify({ message: 'Article supprimé avec succès' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur suppression article:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la suppression de l\'article' }), 
      { status: 500 }
    );
  }
}

export default router;