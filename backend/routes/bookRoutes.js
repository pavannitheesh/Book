const express = require('express');
const router = express.Router();
const { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAllBooks)
router.route('/').post(protect, createBook);

router.route('/:id').get(protect,getBookById)
  
router.route('/:id').put(protect, updateBook)
router.route('/:id').delete(protect,  deleteBook);

module.exports = router;