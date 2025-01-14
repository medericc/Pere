const db = require('../db/db');

const User = {
  create: (username, email, password, role, callback) => {
    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, password, role], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, callback);
  },

  getByUsername: (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], callback);
  },

  update: (id, username, email, password, role, callback) => {
    const sql = `UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?`;
    db.query(sql, [username, email, password, role, id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = User;
