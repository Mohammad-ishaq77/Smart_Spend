const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerRules, loginRules } = require('../middleware/validators');

// Register a new user
router.post('/register', registerRules, register);

// Login existing user
router.post('/login', loginRules, login);

module.exports = router;
