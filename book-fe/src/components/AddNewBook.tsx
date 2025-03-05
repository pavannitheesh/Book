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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input 
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Author</label>
          <input 
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea 
            name="description"
            value={bookData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Cover Image URL</label>
          <input 
            type="url"
            name="coverImage"
            value={bookData.coverImage}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Genres</label>
          <div className="flex mb-2">
            <input 
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-grow border p-2 rounded mr-2"
              placeholder="Add genre"
            />
            <button 
              type="button"
              onClick={handleAddGenre}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Genre
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {bookData.genre.map(g => (
              <span 
                key={g} 
                className="bg-gray-200 px-2 py-1 rounded flex items-center"
              >
                {g}
                <button 
                  type="button"
                  onClick={() => handleRemoveGenre(g)}
                  className="ml-2 text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Publication Date</label>
          <input 
            type="date"
            name="publicationDate"
            value={bookData.publicationDate}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Publisher</label>
          <input 
            type="text"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">ISBN</label>
          <input 
            type="text"
            name="isbn"
            value={bookData.isbn}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox"
              name="featured"
              checked={bookData.featured}
              onChange={handleInputChange}
              className="mr-2"
            />
            Featured Book
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AdminAddBook;