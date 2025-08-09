const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const db = require('../db'); // Kết nối DB nếu cần

// Các route auth hiện có
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/check', authController.checkUser);
router.get('/profile/:id', authController.getProfileById);
router.put('/update-username/:id', authController.updateUsername);
router.put('/update-password/:id', authController.updatePassword);

// Thêm route lấy danh sách user ở đây
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query(`
      SELECT u.id, u.username, u.email, COUNT(fs.id) AS flashcard_set_count
      FROM users u
      LEFT JOIN flashcard_sets fs ON u.id = fs.user_id
      GROUP BY u.id
    `);
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'DB error', error: error.message });
    }
});

module.exports = router;
