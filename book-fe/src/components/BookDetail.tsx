import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import Addtofav from './AddtoFav';

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
    <div className=" mx-auto p-4">
      <div className='flex justify-between'>
      <h1 className="text-4xl font-semibold mb-4">Book Detail</h1>
      <Button><Link to={`/edit/${id}`}>Edit</Link></Button>
      </div>
      {/* <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mr-8">
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-full h-96 object-cover rounded-lg"
          />
          <button 
            onClick={handleAddToFavorites}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          >
            Add to Favorites
          </button>
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
          
          <div className="mb-4">
            <span className="text-yellow-500 text-lg">
              ★ {book.avgRating.toFixed(1)} ({book.reviewCount} reviews)
            </span>
          </div>
          
          <div className="mb-4">
            <h2 className="font-semibold">Description</h2>
            <p>{book.description}</p>
          </div>
          
          <div className="mb-4">
            <strong>Genre:</strong> {book.genre.join(', ')}
            <br />
            <strong>Published:</strong> {new Date(book.publicationDate).toLocaleDateString()}
            <br />
            <strong>ISBN:</strong> {book.isbn}
          </div>
        </div>
      </div> */}
       <div className="grid p-4 sm:p-6 gap-2 dark:text-zinc-50">
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-5xl m-auto">
        <div className="flex flex-col items-center sm:sticky sm:top-[81px] pb-2 rounded-lg h-full">
          <img
            width="512px"
            loading="loading..."
            src={book.coverImage} 
            alt={book.title} 
            className="min-w-full md:min-w-lg object-cover rounded-md"
          />
        </div>
        <div className="h-fit w-full space-y-2">
          <div className="w-full h-full border-2 rounded-lg p-4 border-slate-200 dark:border-zinc-800">
            <h1 className="scroll-m-20 mb-5 text-4xl font-bold tracking-tight lg:text-5xl">
              {book?.title}
            </h1>
            <div className="flex gap-2 items-end">
              <h3 className="italic">by</h3>
              <h2 className="text-2xl font-semibold tracking-tight">
                {book?.author}
              </h2>
            </div>
            <div className="flex space-x-4 text-sm py-4 my-2 border-b-2 border-t-2 border-slate-200 dark:border-zinc-800">
              <div className="pr-4 border-r-2 text-right border-slate-200 dark:border-zinc-800">
                <h3 className="italic w-24 pb-2">Year Published</h3>
                <h4 className="font-semibold">{new Date(book?.publicationDate).toLocaleDateString()}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <h3 className="italic w-full">Genre</h3>
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
                <blockquote className="my-4 italic border-slate-200 dark:border-zinc-800">
                  {book?.description}
                </blockquote>
              </div>
            )}
             <div className="flex gap-2 mb-3 pt-2 items-end  border-t-2 border-slate-200 dark:border-zinc-800">
              <h3 className="italic">ISBN</h3>
              <h2 className="text-lg font-semibold tracking-tight">
                {book?.isbn}
              </h2>
            </div>
            <Addtofav id={id}/>
          </div>
          </div></div></div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="mb-6">
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <select 
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              className="w-full border p-2"
            >
              {[1,2,3,4,5].map(rating => (
                <option key={rating} value={rating}>{rating} Stars</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Review Title</label>
            <input 
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
              className="w-full border p-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Review Content</label>
            <textarea 
              value={newReview.content}
              onChange={(e) => setNewReview({...newReview, content: e.target.value})}
              className="w-full border p-2"
              rows={4}
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="bg-green-500 text-white p-2 rounded"
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div>
          {reviews.map(review => (
            <div key={review._id} className="border-b py-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{review.title}</h3>
                <span className="text-yellow-500">
                  ★ {review.rating}
                </span>
              </div>
              <p className="text-gray-600">{review.content}</p>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;