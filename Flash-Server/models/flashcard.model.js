const db = require('../db');

// Flashcard Set
const createSet = (user_id, title, description) => {
  return db.query('INSERT INTO flashcard_sets (user_id, title, description) VALUES (?, ?, ?)', [user_id, title, description]);
};

const getSetById = (id) => {
  return db.query('SELECT * FROM flashcard_sets WHERE id = ?', [id]);
};

const getSetsByUserId = (user_id) => {
  return db.query('SELECT * FROM flashcard_sets WHERE user_id = ?', [user_id]);
};

const updateSet = (id, title, description) => {
  return db.query('UPDATE flashcard_sets SET title = ?, description = ? WHERE id = ?', [title, description, id]);
};

const deleteSet = (id) => {
  return db.query('DELETE FROM flashcard_sets WHERE id = ?', [id]);
};

// Flashcards
const getFlashcardsBySetId = (setId) => {
  return db.query('SELECT * FROM flashcards WHERE set_id = ?', [setId]);
};

const createFlashcard = (setId, front, back, phonetic, image_url) => {
  return db.query(
    'INSERT INTO flashcards (set_id, front, back, phonetic, image_url) VALUES (?, ?, ?, ?, ?)',
    [setId, front, back, phonetic, image_url]
  );
};

const updateFlashcard = (flashcardId, front, back, phonetic, image_url) => {
  return db.query(
    'UPDATE flashcards SET front = ?, back = ?, phonetic = ?, image_url = ? WHERE id = ?',
    [front, back, phonetic, image_url, flashcardId]
  );
};

const deleteFlashcard = (flashcardId) => {
  return db.query('DELETE FROM flashcards WHERE id = ?', [flashcardId]);
};

const deleteFlashcardsBySetId = (setId) => {
  return db.query('DELETE FROM flashcards WHERE set_id = ?', [setId]);
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.username, u.email, COUNT(s.id) AS flashcard_set_count
      FROM users u
      LEFT JOIN flashcard_sets s ON u.id = s.user_id
      GROUP BY u.id, u.username, u.email
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'DB error', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createSet,
  getSetById,
  getSetsByUserId,
  updateSet,
  deleteSet,
  getFlashcardsBySetId,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  deleteFlashcardsBySetId,
};