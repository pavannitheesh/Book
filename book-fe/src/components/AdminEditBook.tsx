import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEditBook = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
  // Fetch book details when component mounts
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await  axios.get(`http://localhost:3000/api/books/${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
        const book = response.data;

        // Convert publication date to correct format for date input
        const formattedDate = book.publicationDate 
          ? new Date(book.publicationDate).toISOString().split('T')[0] 
          : '';

        setBookData({
          title: book.title || '',
          author: book.author || '',
          description: book.description || '',
          coverImage: book.coverImage || '',
          genre: book.genre || [],
          publicationDate: formattedDate,
          publisher: book.publisher || '',
          isbn: book.isbn || '',
          featured: book.featured || false
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddGenre = () => {
    if (genre && !bookData.genre.includes(genre)) {
      setBookData(prevState => ({
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
      // Update book details
      await axios.put(`http://localhost:3000/api/books/${id}`, bookData,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
      
      // Show success message and redirect
      alert('Book updated successfully!');
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
        alert('Book deleted successfully!');
        navigate('/books');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      
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
            rows="4"
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

        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="flex-grow bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Update Book
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            className="flex-grow bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Delete Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditBook;