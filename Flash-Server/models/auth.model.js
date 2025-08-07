const db = require('../db');

// Kiểm tra user tồn tại bằng email
const findUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = ?', [email]);
};

// Tạo user mới
const createUser = (email, username, hashedPassword) => {
  return db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword]);
};

// Lấy id của user theo email
const getUserIdByEmail = (email) => {
  return db.query('SELECT id FROM users WHERE email = ?', [email]);
};

// Lấy user theo id
const getUserById = (id) => {
  return db.query('SELECT id, email, username, created_at FROM users WHERE id = ?', [id]);
};

// Lấy thông tin người dùng và số lượng flashcard_sets
const getUsersWithSetCount = () => {
  return db.query(`
    SELECT u.id, u.email, u.username, u.created_at, COUNT(fs.id) as set_count
    FROM users u
    LEFT JOIN flashcard_sets fs ON u.id = fs.user_id
    GROUP BY u.id, u.email, u.username, u.created_at
  `);
};

const updateUsername = (id, newUsername) => {
  return db.query('UPDATE users SET username = ? WHERE id = ?', [newUsername, id]);
};

const updatePassword = (id, hashedPassword) => {
  return db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
};

const getPasswordById = (id) => {
  return db.query('SELECT password FROM users WHERE id = ?', [id]);
};

module.exports = {
  findUserByEmail,
  createUser,
  getUserIdByEmail,
  getUserById,
  getUsersWithSetCount,
  updateUsername,
  updatePassword,
  getPasswordById,
};