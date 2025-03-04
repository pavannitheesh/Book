const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public
const getAllBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const genre = req.query.genre || '';
  
  const query = {};
  
  // Add search functionality
  if (search) {
    query.$text = { $search: search };
  }
  
  // Add genre filter
  if (genre) {
    query.genre = genre;
  }
  
  const books = await Book.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Book.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    books,
    currentPage: page,
    totalPages,
    totalBooks: total
  });
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  res.json(book);
});

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    description,
    coverImage,
    genre,
    publicationDate,
    publisher,
    isbn
  } = req.body;
  
  const bookExists = await Book.findOne({ isbn });
  
  if (bookExists) {
    res.status(400);
    throw new Error('Book already exists');
  }
  
  const book = await Book.create({
    title,
    author,
    description,
    coverImage,
    genre,
    publicationDate,
    publisher,
    isbn
  });
  
  res.status(201).json(book);
});

// Remaining controller methods for updateBook and deleteBook...
const updateBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    description,
    coverImage,
    genre,
    publicationDate,
    publisher,
    isbn
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Update book fields
  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;
  book.coverImage = coverImage || book.coverImage;
  book.genre = genre || book.genre;
  book.publicationDate = publicationDate || book.publicationDate;
  book.publisher = publisher || book.publisher;
  book.isbn = isbn || book.isbn;

  const updatedBook = await book.save();

  res.json(updatedBook);
});


const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  await book.remove();

  res.json({ message: 'Book removed' });
});
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,deleteBook
};