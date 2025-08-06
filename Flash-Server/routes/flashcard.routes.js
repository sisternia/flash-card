const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcard.controllers');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '../Uploads/'),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

router.post('/', flashcardController.createSet);
router.get('/', flashcardController.getSets);
router.put('/:id', flashcardController.updateSet);
router.delete('/:id', flashcardController.deleteSet);

router.get('/:setId/flashcards', flashcardController.getFlashcards);
router.post('/:setId/flashcards', upload.any(), flashcardController.addFlashcard);
router.put('/:setId/flashcards/:flashcardId', upload.any(), flashcardController.updateFlashcard);
router.delete('/:setId/flashcards/:flashcardId', flashcardController.deleteFlashcard);

router.get('/:setId/quiz', flashcardController.getQuizQuestions);

module.exports = router;