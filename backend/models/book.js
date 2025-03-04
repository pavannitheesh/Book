const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now

  },
  publisher: {
    type: String,
    
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  avgRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Add text index for search functionality
BookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', BookSchema);