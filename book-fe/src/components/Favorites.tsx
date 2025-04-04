import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import BookCard from './BookCard';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  avgRating: number;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${userInfo._id}`,
          { headers: { 'Authorization': `Bearer ${userInfo.token}` } }
        );
        setFavorites(response.data.favoriteBooks || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch favorite books');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return (
    <div className="w-full grid items-center min-h-screen">
      <Loader2 className="mx-auto h-10 w-10 animate-spin" />
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Favorite Books</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorite books yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
          {favorites.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;