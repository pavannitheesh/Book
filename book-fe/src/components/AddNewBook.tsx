import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAddBook = () => {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: [],
    publicationDate: '',
    publisher: '',
    isbn: '',
    featured: false
  });

  const [imageError, setImageError] = useState(false);

  const [genre, setGenre] = useState('');
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddGenre = () => {
    if (genre && !bookData.genre.includes(genre)) {
      setBookData((prevState) => ({
        ...prevState,
        genre: [...prevState.genre, genre]
      }));
      setGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setBookData(prevState => ({
      ...prevState,
      genre: prevState.genre.filter(g => g !== genreToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}"); 
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/books`, bookData, { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
      alert('Book added successfully!');
      navigate("/books");
      setBookData({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        genre: [],
        publicationDate: '',
        publisher: '',
        isbn: '',
        featured: false
      });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Add New Book</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Book Title</label>
          <input 
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Author Name</label>
          <input 
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Book Description</label>
          <textarea 
            name="description"
            value={bookData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cover Image URL</label>
            <input 
              type="url"
              name="coverImage"
              value={bookData.coverImage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          {bookData.coverImage && (
            <div className="w-48 h-48 relative border rounded-md overflow-hidden">
              <img
                src={bookData.coverImage}
                alt="Book cover preview"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                  Invalid image URL
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Book Genres</label>
          <div className="flex space-x-2">
            <input 
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Type a genre and press Add"
            />
            <button 
              type="button"
              onClick={handleAddGenre}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-gray-400"
            >
              Add Genre
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {bookData.genre.map(g => (
              <span 
                key={g} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {g}
                <button 
                  type="button"
                  onClick={() => handleRemoveGenre(g)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Publication Date</label>
            <input 
              type="date"
              name="publicationDate"
              value={bookData.publicationDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">ISBN Number</label>
            <input 
              type="text"
              name="isbn"
              value={bookData.isbn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Publisher Name</label>
          <input 
            type="text"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
            <input 
              type="checkbox"
              name="featured"
              checked={bookData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span>Featured Book</span>
          </label>
        </div>
        <button 
          type="submit" 
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
        >
          Add Book
        </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;