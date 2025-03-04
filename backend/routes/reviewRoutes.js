const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReviewsByBook,
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
} = require('../controllers/reviewController');

// @desc    Get reviews for a book
// @route   GET /api/reviews?bookId=123
// @access  Public
router.get('/', getReviewsByBook);

// @desc    Get reviews by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
router.get('/user/:userId', getReviewsByUser);

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, createReview);


// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, deleteReview);

// @desc    Like a review
// @route   POST /api/reviews/:id/like
// @access  Private
router.post('/:id/like', protect, likeReview);

module.exports = router;