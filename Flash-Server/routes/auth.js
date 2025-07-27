const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const SECRET = 'your_secret_key'; // Đổi thành key bảo mật riêng

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) return res.status(400).json({ msg: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.json({ msg: 'Register success' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ msg: 'User not found' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
    // Trả về cả id và username
    res.json({ msg: 'Login success', token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Xác thực user (check login status)
router.post('/check', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ msg: 'Missing username' });
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User valid', id: rows[0].id });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

module.exports = router; 