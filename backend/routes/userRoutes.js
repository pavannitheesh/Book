const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  toggleFavorite,
} = require('../controllers/userController');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get('/:id', protect, getUserProfile);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', protect, updateUserProfile);
router.post('/favorites', protect,toggleFavorite);


module.exports = router;