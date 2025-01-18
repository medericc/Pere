import db from '../../../../db/db.js';

export async function GET(req) {
  // Extraire l'ID de l'URL
  const id = req.nextUrl.pathname.split('/').pop();  // L'ID est la dernière partie de l'URL

  if (!id) {
    return new Response(JSON.stringify({ message: 'ID de l\'article requis' }), { status: 400 });
  }

  try {
    const query = `
      SELECT articles.*, users.username AS author_username
      FROM articles
      LEFT JOIN users ON articles.username = users.username
      WHERE articles.id = ?
    `;
    
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return new Response(JSON.stringify({ message: 'Article non trouvé' }), { status: 404 });
    }

    return new Response(JSON.stringify(results[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur récupération article:', error);
    return new Response(JSON.stringify({ message: 'Erreur récupération article' }), { status: 500 });
  }
}
