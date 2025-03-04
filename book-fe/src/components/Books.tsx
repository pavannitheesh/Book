import React, { useEffect, useState } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch books');
        }
console.log(data.books);
        setBooks(data.books);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="book-list">
      <h2>All Books</h2>
      <div className="books-container">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.coverImage} alt={book.title} className="book-cover" />
            <div className="book-details">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre.join(', ')}</p>
              <p><strong>Published:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
              <p><strong>Rating:</strong> {book.avgRating.toFixed(1)}/5 ({book.reviewCount} reviews)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;