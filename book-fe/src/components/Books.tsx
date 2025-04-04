import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import BookCard from './BookCard';
import Sidebar from './Sidebar';

import { Input } from './ui/input';
import { Select } from './Select';

interface BooksProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  filterGenre?: string;
  setFilterGenre?: (genre: string) => void;
}

const Books: React.FC<BooksProps> = ({ searchTerm = '', setSearchTerm = () => {}, filterGenre = '', setFilterGenre = () => {} }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userInitial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?';

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
  const Logout=()=>{
    localStorage.removeItem('userInfo');
    navigate('/login');

  }
  // if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>

      
      {loading ? (
            <div className="w-full grid items-center">
              <Loader2 className="mx-auto  h-10 w-10 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap">
              {books?.map((book) => (
                <BookCard key={book._id} book={book}/> 
        //  <Link 
        //          to={`/books/${book._id}`} 
                 
        //        >
        //   <div 
        //     key={book._id} 
        //     className="border rounded-lg p-4 hover:shadow-lg transition"
        //   >
        //      <Suspense fallback={<>loading...</>}>
        //     <img 
        //       src={book.coverImage} 
        //       alt={book.title} 
        //       className="w-full h-full object-cover object-center transition-transform duration-500 rounded-lg shadow-md group-hover:scale-105"
        //     />
        //     </Suspense>
        //     <h2 className="text-xl font-semibold">{book.title}</h2>
        //     <p className="text-gray-600">{book.author}</p>
        //     <div className="flex justify-between mt-2">
        //       <span className="text-yellow-500">
        //         ★ {book.avgRating.toFixed(1)}
        //       </span>
             
                
        //     </div>
        //   </div>
        //   </Link>
        ))}
      </div>
      )
      }
      </div>
  
   
  );
};

export default Books;