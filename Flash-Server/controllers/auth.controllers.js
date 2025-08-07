const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');

const SECRET = 'your_secret_key';

// Đăng ký
const register = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ msg: 'Missing fields' });

  try {
    const [users] = await authModel.findUserByEmail(email);
    if (users.length > 0) return res.status(400).json({ msg: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await authModel.createUser(email, username, hash);
    res.json({ msg: 'Register success' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

  try {
    const [users] = await authModel.findUserByEmail(email);
    if (users.length === 0) return res.status(400).json({ msg: 'User not found' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' });
    res.json({
      msg: 'Login success',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Check user hợp lệ
const checkUser = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Missing email' });

  try {
    const [rows] = await authModel.getUserIdByEmail(email);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: 'User valid', id: rows[0].id });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Lấy thông tin người dùng theo id
const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await authModel.getUserById(id);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

// Lấy thông tin tất cả người dùng và số lượng flashcard_sets
const getAllUsersWithSetCount = async (req, res) => {
  try {
    const [rows] = await authModel.getUsersWithSetCount();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

const updateUsername = async (req, res) => {
  const { id } = req.params;
  const { newUsername } = req.body;
  if (!newUsername) return res.status(400).json({ msg: 'Missing new username' });

  try {
    await authModel.updateUsername(id, newUsername);
    res.json({ msg: 'Username updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ msg: 'Missing fields' });

  try {
    const [rows] = await authModel.getPasswordById(id);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match) return res.status(400).json({ msg: 'Incorrect current password' });

    const hash = await bcrypt.hash(newPassword, 10);
    await authModel.updatePassword(id, hash);
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

module.exports = {
  register,
  login,
  checkUser,
  getProfileById,
  getAllUsersWithSetCount,
  updateUsername,
  updatePassword,
};