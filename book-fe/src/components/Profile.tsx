import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface User {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
          { headers: { 'Authorization': `Bearer ${userInfo.token}` } }
        );
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return (
    <div className="w-full grid items-center min-h-screen">
      <Loader2 className="mx-auto h-10 w-10 animate-spin" />
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.jpg';
            }}
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{user.role}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-gray-700">{user.bio || 'No bio available'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;