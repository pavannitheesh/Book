import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import Addtofav from './AddtoFav';
import StarRating from './StarRating';

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('userInfo') || "{}");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
       
        const [bookResponse, reviewsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews?bookId=${id}`,{ headers: { 'Authorization': `Bearer ${userInfo.token}` } })
        ]);
        setBook(bookResponse.data);
        setReviews(reviewsResponse.data);
       
        console.log("reviews"+reviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        console.log(err);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
        ...newReview,
        user: user._id,bookId:id
      },{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
      if(response.data.includes("reviewed")){
        alert(response.data);
      }
      else{
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, title: '', content: '' });
      }
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="mx-auto p-4 bg-background text-foreground">
      <div className='flex justify-between'>
        <h1 className="text-4xl font-semibold mb-4">Book Detail</h1>
        <Button><Link to={`/edit/${id}`}>Edit</Link></Button>
      </div>
      <div className="grid p-4 sm:p-6 gap-2">
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-5xl m-auto">
          <div className="flex flex-col items-center sm:sticky sm:top-[81px] pb-2 rounded-lg h-full">
            <img
              width="512px"
              loading="loading..."
              src={book.coverImage} 
              alt={book.title} 
              className="min-w-full md:min-w-lg object-cover rounded-md shadow-md"
            />
          </div>
          <div className="h-fit w-full space-y-2">
            <div className="w-full h-full border rounded-lg p-4 border-border bg-card text-card-foreground">
              <h1 className="scroll-m-20 mb-5 text-4xl font-bold tracking-tight lg:text-5xl">
                {book?.title}
              </h1>
              <div className="flex gap-2 items-end">
                <h3 className="italic text-muted-foreground">by</h3>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {book?.author}
                </h2>
              </div>
              <div className="flex space-x-4 text-sm py-4 my-2 border-b border-t border-border">
                <div className="pr-4 border-r text-right border-border">
                  <h3 className="italic w-24 pb-2 text-muted-foreground">Year Published</h3>
                  <h4 className="font-semibold">{new Date(book?.publicationDate).toLocaleDateString()}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h3 className="italic w-full text-muted-foreground">Genre</h3>
                  {book?.genre?.map((genre, index) => (
                    <Badge variant="outline" key={index}>
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              {book?.description && (
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Description
                  </h3>
                  <blockquote className="my-4 italic text-muted-foreground border-border">
                    {book?.description}
                  </blockquote>
                </div>
              )}
              <div className="flex gap-2 mb-3 pt-2 items-end border-t border-border">
                <h3 className="italic text-muted-foreground">ISBN</h3>
                <h2 className="text-lg font-semibold tracking-tight">
                  {book?.isbn}
                </h2>
              </div>
              <Addtofav id={id}/>
            </div>
          </div>
        </div>
      </div>
    

    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Reviews</h2>
      
      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4 mb-6 border border-border">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({...newReview, rating})}
            />
          </div>
          
          <div>
            <input 
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
              className="w-full rounded-md border border-border p-2 bg-background text-foreground"
              placeholder="Review title"
              required
            />
          </div>
            
            <div>
              <textarea 
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                className="w-full rounded-md border border-border p-2 bg-transparent"
                rows={3}
                placeholder="Share your thoughts about the book"
                required
              ></textarea>
            </div>
            
            <Button 
              type="submit"
              className="w-full md:w-auto"
            >
              Submit Review
            </Button>
          </form>
        </div>
        
        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-start gap-3">
                <img
                  src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=random`}
                  alt={review.user?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold truncate">{review.title}</h3>
                    <StarRating rating={review.rating} onRatingChange={() => {}} editable={false} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-zinc-300">{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;