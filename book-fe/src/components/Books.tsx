import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books`, {
          params: { 
            search: searchTerm, 
            genre: filterGenre 
          }
        });
        setBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books');
        console.log(err)
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, filterGenre]);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
      
      <Link to="/addbook"> <Button>Add Book</Button></Link>
       </div>
      
      <div className="flex mb-4 space-x-4 justify-center">
        <input 
          type="text" 
          placeholder="Search books..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-[300px]"
        />
        
        <select 
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="border p-2"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map(book => (
          <div 
            key={book._id} 
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-64 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <div className="flex justify-between mt-2">
              <span className="text-yellow-500">
                ★ {book.avgRating.toFixed(1)}
              </span>
              <Link 
                to={`/books/${book._id}`} 
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;