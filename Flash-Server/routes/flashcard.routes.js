const express = require('express');
const db = require('../db');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

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

// API lấy danh sách flashcards của 1 bộ thẻ
router.get('/:setId/flashcards', async (req, res) => {
  const { setId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM flashcards WHERE set_id = ?', [setId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// API thêm từ vựng vào bộ thẻ, hỗ trợ upload ảnh hoặc nhận URL ảnh
router.post('/:setId/flashcards', upload.any(), async (req, res) => {
  const { setId } = req.params;
  const { front, phonetic, back } = req.body;
  let image_url = req.body.image_url || null;
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);
  if (image_url && !/^https?:\/\//.test(image_url)) {
    image_url = 'https://' + image_url;
  }
  let final_image_url = image_url;
  if (req.files && req.files.length > 0) {
    final_image_url = '/uploads/' + req.files[0].filename;
  }
  try {
    const [result] = await db.query(
      'INSERT INTO flashcards (set_id, front, back, phonetic, image_url) VALUES (?, ?, ?, ?, ?)',
      [setId, front, back, phonetic, final_image_url]
    );
    res.status(201).json({ id: result.insertId, front, phonetic, back, image_url: final_image_url });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Xóa từ vựng khỏi bộ thẻ
router.delete('/:setId/flashcards/:flashcardId', async (req, res) => {
  const { flashcardId } = req.params;
  try {
    await db.query('DELETE FROM flashcards WHERE id = ?', [flashcardId]);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Sửa thông tin từ vựng (có thể upload lại ảnh hoặc nhận URL ảnh)
router.put('/:setId/flashcards/:flashcardId', upload.any(), async (req, res) => {
  const { flashcardId } = req.params;
  const { front, phonetic, back } = req.body;
  let image_url = req.body.image_url || null;
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);
  if (image_url && !/^https?:\/\//.test(image_url)) {
    image_url = 'https://' + image_url;
  }
  let final_image_url = image_url;
  if (req.files && req.files.length > 0) {
    final_image_url = '/uploads/' + req.files[0].filename;
  }
  try {
    let sql = 'UPDATE flashcards SET front = ?, back = ?';
    let params = [front, back];
    if (typeof phonetic !== 'undefined') {
      sql += ', phonetic = ?';
      params.push(phonetic);
    }
    if (final_image_url) {
      sql += ', image_url = ?';
      params.push(final_image_url);
    }
    sql += ' WHERE id = ?';
    params.push(flashcardId);
    await db.query(sql, params);
    res.json({ msg: 'Updated' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

// Sửa tên/thêm ghi chú cho bộ flashcard
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await db.query('UPDATE flashcard_sets SET title = ?, description = ? WHERE id = ?', [title, description, id]);
    res.json({ msg: 'Updated' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});
// Xóa bộ flashcard và toàn bộ từ vựng thuộc bộ đó
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM flashcards WHERE set_id = ?', [id]);
    await db.query('DELETE FROM flashcard_sets WHERE id = ?', [id]);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
});

module.exports = router; 