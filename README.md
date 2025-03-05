# Book Review Platform

## Overview
A full-stack book review platform that allows users to browse, review, and manage books. The application provides features for book enthusiasts, including user authentication, book reviews, favorites, and admin management.

## Tech Stack
### Frontend
- React.js
- React Router
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT) for authentication
- bcryptjs for password hashing

### Additional Libraries
- mongoose: ODM for MongoDB
- jsonwebtoken: Authentication
- bcryptjs: Password encryption
- cors: Cross-origin resource sharing
- dotenv: Environment variable management

## Features
- User Authentication (Signup/Login)
- Book Browsing
- Book Details and Reviews
- Add Books to Favorites
- Write and Manage Reviews
- Admin Book Management
- Search and Filter Books



## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/pavannitheesh/Book.git
cd Book
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables
touch .env
```

#### Required .env Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

#### Start Backend Server
```bash
# In backend directory
npm start
# Or with nodemon for development
npm run dev
```

#### Start Frontend Development Server
```bash
# In frontend directory
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/signup`: User registration
- `POST /api/users/login`: User login

### Books
- `GET /api/books`: List books
- `GET /api/books/:id`: Get book details
- `POST /api/books`: Add new book (Admin)
- `PUT /api/books/:id`: Update book (Admin)
- `DELETE /api/books/:id`: Delete book (Admin)

### Reviews
- `GET /api/books/:id/reviews`: Get book reviews
- `POST /api/books/:id/reviews`: Add review
- `DELETE /api/reviews/:id`: Delete review

### User Favorites(To be done)
- `GET /api/user/favorites`: List favorite books
- `POST /api/user/favorites`: Add book to favorites
- `DELETE /api/user/favorites/:id`: Remove from favorites


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Recommended Development Workflow
1. Set up MongoDB database
2. Implement backend models and routes
3. Create authentication middleware
4. Develop frontend components
5. Integrate frontend with backend APIs
6. Add error handling and validation
7. Test thoroughly
8. Deploy

## Project Structure
```
book-review-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookList.js
│   │   │   ├── BookDetail.js
│   │   │   ├── UserProfile.js
│   │   │   ├── AdminAddBook.js
│   │   │   └── AdminEditBook.js
│   │   ├── App.js
│   │   └── index.js
│
├── backend/
│   ├── models/
│   │   ├── Book.js
│   │   ├── User.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   ├── userRoutes.js
│   │   └── reviewRoutes.js
│   ├── controllers/
│   │   ├── bookController.js
│   │   ├── userController.js
│   │   └── reviewController.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```
