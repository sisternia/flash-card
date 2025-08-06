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

const getRandomQuizBySetId = (setId, limit = 10) => {
  const sql = `
    SELECT 
      f1.id AS flashcard_id,
      f1.phonetic,
      f1.back,
      f1.front AS correct_front,
      JSON_ARRAYAGG(f2.front) AS choices
    FROM flashcards f1
    JOIN (
      SELECT front FROM flashcards WHERE set_id = ? ORDER BY RAND() LIMIT 4
    ) f2 ON 1=1
    WHERE f1.set_id = ?
    GROUP BY f1.id
    ORDER BY RAND()
    LIMIT ?;
  `;
  return db.query(sql, [setId, setId, limit]);
};

module.exports = {
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
  getRandomQuizBySetId
};
