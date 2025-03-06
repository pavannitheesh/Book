const asyncHandler = require('express-async-handler');
const {User} = require('../models/user');
const Book = require('../models/book');
const mongoose = require('mongoose');
// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .select('-password') // Exclude password field
      .populate('favoriteBooks', 'title author coverImage'); // Populate favoriteBooks with specific fields
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    res.json(user);
  });
// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    // Ensure the logged-in user matches the user being updated
    if (user._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this profile');
    }
  
    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;
  
    // Update favoriteBooks if provided
    if (req.body.favoriteBooks) {
      user.favoriteBooks = req.body.favoriteBooks;
    }
  
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
  
    const updatedUser = await user.save();
  
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      favoriteBooks: updatedUser.favoriteBooks,
    });
  });
  const toggleFavorite =asyncHandler(async(req,res)=>{
    try {
      const { bookId } = req.body;
      
      // Validate bookId
      if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
      
      // Check if book exists
      const bookExists = await Book.exists({ _id: bookId });
      if (!bookExists) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      // Get user
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if book is already in favorites
      const bookIndex = user.favoriteBooks.indexOf(bookId);
      let message = '';
      
      if (bookIndex > -1) {
        // Book exists in favorites, remove it
        user.favoriteBooks.splice(bookIndex, 1);
        message = 'Book removed from favorites';
      } else {
        // Book not in favorites, add it
        user.favoriteBooks.push(bookId);
        message = 'Book added to favorites';
      }
      
      // Save updated user
      await user.save();
      
      res.status(200).json({ 
        success: true, 
        message,
        favoriteBooks: user.favoriteBooks
      });
      
    } catch (error) {
      console.error('Error toggling favorite book:', error);
      res.status(500).json({ 
        message: 'Server error',
        error: error.message 
      });
    }
  });
  

module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleFavorite
};