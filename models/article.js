const db = require('../db/db');

const Article = {
  create: (title, content, image, username, category_id, callback) => {
    const sql = `INSERT INTO articles (title, content, image, username, category_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [title, content, image, username, category_id], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM articles`;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `SELECT * FROM articles WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  update: (id, title, content, image, category_id, callback) => {
    const sql = `UPDATE articles SET title = ?, content = ?, image = ?, category_id = ? WHERE id = ?`;
    db.query(sql, [title, content, image, category_id, id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM articles WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Article;
