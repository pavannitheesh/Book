const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
router.post('/signin', signin);

module.exports = router;

