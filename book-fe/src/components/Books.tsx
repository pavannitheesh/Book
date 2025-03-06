import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import BookCard from './BookCard';
import { Navbar } from './Navbar';
import { Input } from './ui/input';
import { Select } from './Select';

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

  // if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Navbar/>
      <Link to="/addbook"> <Button>Add Book</Button></Link>
      
      <div className="flex mb-4 space-x-4 justify-center">
        <Input 
          type="text" 
          placeholder="Search books..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full rounded-lg bg-background pl-10 pr-14 sm:w-[200px] lg:w-[336px]"
        />
         <Select onChange={(value: React.SetStateAction<string>) => setFilterGenre(value)} />
        

      </div>

      
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