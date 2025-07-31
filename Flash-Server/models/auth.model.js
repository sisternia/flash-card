const db = require('../db');

// Kiểm tra user tồn tại
const findUserByUsername = (username) => {
  return db.query('SELECT * FROM users WHERE username = ?', [username]);
};

// Tạo user mới
const createUser = (username, hashedPassword) => {
  return db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
};

// Lấy id của user theo username
const getUserIdByUsername = (username) => {
  return db.query('SELECT id FROM users WHERE username = ?', [username]);
};

module.exports = {
  findUserByUsername,
  createUser,
  getUserIdByUsername,
};
