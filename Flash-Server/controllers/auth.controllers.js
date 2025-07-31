const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

const SECRET = 'your_secret_key'; // Đổi thành key bảo mật riêng

// Đăng ký
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });

  try {
    const [users] = await authModel.findUserByUsername(username);
    if (users.length > 0) return res.status(400).json({ msg: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    await authModel.createUser(username, hash);
    res.json({ msg: 'Register success' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await authModel.findUserByUsername(username);
    if (users.length === 0) return res.status(400).json({ msg: 'User not found' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
    res.json({ msg: 'Login success', token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Check user hợp lệ
const checkUser = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ msg: 'Missing username' });

  try {
    const [rows] = await authModel.getUserIdByUsername(username);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: 'User valid', id: rows[0].id });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

module.exports = {
  register,
  login,
  checkUser,
};
