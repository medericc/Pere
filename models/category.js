const db = require('../db/db');

const Category = {
  create: (name, description, callback) => {
    const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;
    db.query(sql, [name, description], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM categories`;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `SELECT * FROM categories WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  update: (id, name, description, callback) => {
    const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
    db.query(sql, [name, description, id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM categories WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Category;
