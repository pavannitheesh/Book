const Review = require('../models/user');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

// @desc    Get reviews for a book
// @route   GET /api/reviews?bookId=123
// @access  Public
const getReviewsByBook = asyncHandler(async (req, res) => {
  const { bookId } = req.query;
  
  if (!bookId) {
    res.status(400);
    throw new Error('Book ID is required');
  }
  
  const reviews = await Review.find({ book: bookId, approved: true })
    .sort({ createdAt: -1 })
    .populate('user', 'name avatar');
  
  res.json(reviews);
});

// @desc    Get reviews by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsByUser = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.params.userId, approved: true })
    .sort({ createdAt: -1 })
    .populate('book', 'title author coverImage');
  
  res.json(reviews);
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, title, content } = req.body;
  
  // Validate input
  if (!bookId || !rating || !title || !content) {
    res.status(400);
    throw new Error('All fields are required');
  }
  
  // Check if user has already reviewed this book
  const existingReview = await Review.findOne({ 
    user: req.user._id, 
    book: bookId 
  });
  
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }
  
  // Create the review
  const review = await Review.create({
    user: req.user._id,
    book: bookId,
    rating,
    title,
    content
  });
  
  // Update book rating
  await updateBookRating(bookId);
  
  // Return the review with user data
  const populatedReview = await Review.findById(review._id)
    .populate('user', 'name avatar');
  
  res.status(201).json(populatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check ownership
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  
  // Store book ID before deletion
  const bookId = review.book;
  
  // Delete the review
  await review.remove();
  
  // Update book rating
  await updateBookRating(bookId);
  
  res.json({ message: 'Review removed' });
});

// @desc    Like a review
// @route   POST /api/reviews/:id/like
// @access  Private
const likeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if the user has already liked the review
  const alreadyLiked = review.likes.includes(req.user._id);
  
  if (alreadyLiked) {
    // Remove like
    review.likes = review.likes.filter(id => id.toString() !== req.user._id.toString());
  } else {
    // Add like
    review.likes.push(req.user._id);
  }
  
  await review.save();
  
  res.json({ likes: review.likes });
});

// Helper function to update book rating
const updateBookRating = async (bookId) => {
  // Get all approved reviews for the book
  const reviews = await Review.find({ book: bookId, approved: true });
  
  if (reviews.length === 0) {
    // No reviews, reset rating to 0
    await Book.findByIdAndUpdate(bookId, { 
      avgRating: 0,
      reviewCount: 0
    });
    return;
  }
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length;
  
  // Update book document
  await Book.findByIdAndUpdate(bookId, { 
    avgRating,
    reviewCount: reviews.length
  });
};

module.exports ={
    updateBookRating,
    likeReview,getReviewsByBook,createReview,getReviewsByUser,deleteReview
}