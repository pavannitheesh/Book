import React from 'react';
import { User, Heart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-background shadow-md flex flex-col items-center py-4 space-y-4">
      <Link 
        to="/books" 
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        title="Home"
      >
        <Home className="w-6 h-6" />
      </Link>
      <Link 
        to={`/profile/${userInfo._id}`} 
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        title="Profile"
      >
        <User className="w-6 h-6" />
      </Link>
      <Link 
        to="/favorites" 
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        title="Favorites"
      >
        <Heart className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Sidebar;