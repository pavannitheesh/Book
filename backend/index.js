const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// const { errorHandler } = require('./middleware/errorMiddleware');
const dotenv=require( "dotenv"); // Import dotenv
dotenv.config({
    path:'.env' //give .env file location
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// // Error handling middleware
// app.use(errorHandler);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
  
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });