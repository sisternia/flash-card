const express = require('express');
const db = require('../db');
const router = express.Router();

// Tạo bộ flashcard mới
router.post('/', async (req, res) => {
  const { user_id, title, description } = req.body;
  if (!user_id || !title) return res.status(400).json({ msg: 'Missing fields' });
  try {
    const [result] = await db.query(
      'INSERT INTO flashcard_sets (user_id, title, description) VALUES (?, ?, ?)',
      [user_id, title, description || null]
    );
    const [rows] = await db.query('SELECT * FROM flashcard_sets WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Xóa bộ flashcard
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM flashcard_sets WHERE id = ?', [id]);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Lấy danh sách bộ flashcard của user
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ msg: 'Missing user_id' });
  try {
    const [rows] = await db.query('SELECT * FROM flashcard_sets WHERE user_id = ?', [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

module.exports = router; 