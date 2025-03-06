
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useState } from "react";
export default function Addtofav({id}) {
  const [isLiked, setisLiked] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
  const handleAddToFavorites = async () => {
    try {
     const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/favorites`, { bookId: id },{ headers: { 'Authorization': `Bearer ${userInfo.token}` } });
     if(response.data.favoriteBooks.length > 0) {
      setisLiked(true);
    
    }
    else setisLiked(false);
     console.log(response); 
     alert('Book added to favorites!');
    } catch (err) {
      alert('Failed to add book to favorites');
      console.log(err)
    }
  };
  return (
    <Button  variant="outline"   onClick={handleAddToFavorites} className={`flex mr-2 p-2 relative group md:px-2 gap-2 border-2 ${
      isLiked
        ? "bg-red-100 hover:bg-red-200/80 border-red-200 dark:border-red-900 dark:hover:bg-red-800/80 dark:bg-red-800/50"
        : ""
    }`}>
      <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 transition-transform duration-200 group-hover:scale-100" />
      <HeartIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary group-active:animate-pulse" /> Favorite
    </Button>
  )
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}