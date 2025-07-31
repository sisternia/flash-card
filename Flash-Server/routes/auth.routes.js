const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/check', authController.checkUser);

module.exports = router;
