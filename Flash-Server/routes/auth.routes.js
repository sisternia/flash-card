const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/check', authController.checkUser);
router.get('/profile/:id', authController.getProfileById);
router.put('/update-username/:id', authController.updateUsername);
router.put('/update-password/:id', authController.updatePassword);

module.exports = router;
