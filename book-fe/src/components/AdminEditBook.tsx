import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Label } from './ui/Label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { X, Loader2 } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
  // Fetch book details when component mounts
  
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await  axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
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
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`, bookData,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
      
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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
        alert('Book deleted successfully!');
        navigate('/books');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  if (loading) return (
    <div className="w-full grid items-center min-h-screen">
      <Loader2 className="mx-auto h-10 w-10 animate-spin" />
    </div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Edit Book</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-4">
        <div className="mb-4">
          <Label className="block mb-2">Title</Label>
          <Input 
            type="text"
            name="title"
            placeholder="Title of the Book"
            value={bookData.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <Label className="block mb-2">Author</Label>
          <Input 
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>

        <div className="mb-4">
          <Label className="block mb-2">Description</Label>
          <Textarea 
            name="description"
            value={bookData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          ></Textarea>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</Label>
            <Input 
              type="url"
              name="coverImage"
              value={bookData.coverImage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:bg-gray-700 dark:text-gray-100"
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
          <Label className="block mb-2">Genres</Label>
          <div className="flex mb-2">
            <Input 
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-grow border p-2 rounded mr-2"
              placeholder="Add genre"
            />
            <Button 
              type="button"
              onClick={handleAddGenre}
            className='cursor-pointer'
            >
              Add Genre
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {bookData.genre.map(g => (
              <span 
                key={g} 
                className="bg-gray-200 px-2 py-1 rounded flex items-center"
              >
                {g}
                <Button variant="ghost"
                  type="button"
                  onClick={() => handleRemoveGenre(g)}
                
                >
                 <X/>
                </Button>
              </span>
            ))}
          </div>
        </div>
<div className='flex space-x-8'>
        <div className="mb-4">
          <Label className="block mb-2">Publication Date</Label>
          <Input 
            type="date"
            name="publicationDate"
            value={bookData.publicationDate}
            onChange={handleInputChange}
            className="w-fit border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <Label className="block mb-2">ISBN</Label>
          <Input 
            type="text"
            name="isbn"
            value={bookData.isbn}
            onChange={handleInputChange}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Publisher</Label>
          <Input 
            type="text"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>


        <div className="mb-4">
          <Label className="flex items-center">Featured Book
            <Input 
              type="checkbox"
              name="featured"
              checked={bookData.featured}
              onChange={handleInputChange}
              className='w-4 h-4 text-black bg-gray-100 border-gray-300 rounded-sm focus:ring-black dark:focus:ring-black dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            /></Label>
            
          
        </div>

        <div className="flex justify-between">
          <Button 
            type="submit" 
           
          >
            Update Book
          </Button>
          <Button variant="destructive" 
            type="button"
            onClick={handleDelete}
           
          >
            Delete Book
          </Button>
        </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBook;