const asyncHandler = require('express-async-handler');
const {User} = require('../models/user');

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

module.exports = {
  getUserProfile,
  updateUserProfile,
};