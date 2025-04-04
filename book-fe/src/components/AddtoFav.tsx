
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
export default function Addtofav({id}) {
  const [isLiked, setisLiked] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
  const [isHeartLoading, setIsHeartLoading] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userInfo._id}`, 
          { headers: { 'Authorization': `Bearer ${userInfo.token}` } }
        );
        const isFavorite = response.data.favoriteBooks.some(book => book._id === id);
        setisLiked(isFavorite);
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    };
    if (userInfo._id) {
      checkIfFavorite();
    }
  }, [id, userInfo._id]);
  const handleAddToFavorites = async () => {
    try {
      setIsHeartLoading(true);
     const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/favorites`, { bookId: id },{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
     if(response.data.favoriteBooks.length > 0) {
      setIsHeartLoading(false);
      setisLiked(true);
    
    }
    else {
      setIsHeartLoading(false);
      setisLiked(false);}
     console.log(response); 
   
    } catch (err) {
      
      console.log(err)
    }
  };
  return (
    <Button
              variant="outline"
              title={isLiked ? "Remove" : "Add"}
              className={`flex mr-2 p-2 md:px-2 gap-2 border-2 ${
                isLiked
                  ? "bg-red-100 hover:bg-red-200/80 border-red-200 dark:border-red-900 dark:hover:bg-red-800/80 dark:bg-red-800/50"
                  : ""
              }`}
              onClick={handleAddToFavorites}>
      <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 transition-transform duration-200 group-hover:scale-100" />
      {isHeartLoading ? (
                <Loader2
                  color="red"
                  strokeWidth={2.5}
                  opacity={0.5}
                  className="w-8 h-8 animate-spin"
                />
              ) : (
                <Heart isLiked={isLiked} />
              )}
                <span>
                {isLiked ? "Added to Favourites" : "Add to Favourites"}
              </span>
            </Button>
  )
}
const Heart = ({ isLiked }) => {
  return (
    <div className="relative heart-btn w-fit">
      <span
        className={`absolute heart pointer-events-none ${
          isLiked ? "heart-active" : ""
        }`}></span>
      <span className="relative p-4 cursor-pointer flex items-center rounded-full justify-center"></span>
    </div>
  );
};

