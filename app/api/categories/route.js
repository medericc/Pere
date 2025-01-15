import db from '../../../db/db.js';

// Fonction pour récupérer toutes les catégories
export async function GET(req) {
  try {
    const query = `SELECT * FROM categories ORDER BY id DESC`;
    const results = await db.query(query);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 });
  }
}

// Fonction pour créer une nouvelle catégorie
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new Response(
        JSON.stringify({ message: 'Le nom de la catégorie est requis' }), 
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;

    const [result] = await db.query(query, [name, description || null]);

    // Récupérer la catégorie créée
    const [newCategory] = await db.query(`
      SELECT * FROM categories WHERE id = ?
    `, [result.insertId]);

    return new Response(
      JSON.stringify(newCategory),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la création de la catégorie' }), 
      { status: 500 }
    );
  }
}

// Fonction pour modifier une catégorie
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID de la catégorie requis' }), 
        { status: 400 }
      );
    }

    const { name, description } = await req.json();

    const query = `
      UPDATE categories 
      SET name = ?, description = ?
      WHERE id = ?
    `;
    
    await db.query(query, [name, description, id]);

    // Récupérer la catégorie mise à jour
    const [updatedCategory] = await db.query(`
      SELECT * FROM categories WHERE id = ?
    `, [id]);

    return new Response(
      JSON.stringify(updatedCategory),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erreur modification catégorie:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la modification de la catégorie' }), 
      { status: 500 }
    );
  }
}

// Fonction pour supprimer une catégorie
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'ID de la catégorie requis' }), 
        { status: 400 }
      );
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    return new Response(
      JSON.stringify({ message: 'Catégorie supprimée avec succès' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la suppression de la catégorie' }), 
      { status: 500 }
    );
  }
}
