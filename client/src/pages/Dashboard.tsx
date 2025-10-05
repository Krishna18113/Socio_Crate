// client/src/pages/Dashboard.tsx (UPDATED)
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';
// 🔑 Import the new getMyPosts function
import { getMyPosts } from '../api/post'; 
// Note: getPosts is no longer needed here

export default function Dashboard() {
  const { user, logout } = useAuth()!;
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);

  // 🔑 RENAME/UPDATE: Function now fetches ONLY the current user's posts
  const fetchUserPosts = async () => {
    try {
        // Use the user-specific API call
        const data = await getMyPosts();
        setPosts(data);
    } catch (error) {
        // Handle error, e.g., if token expires
        console.error("Failed to fetch user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6 p-4 border-b">
        <div className="text-xl font-bold">🧠 SocioCrate</div>
        <div className="space-x-4">
          <button onClick={() => navigate('/feed')} className="text-blue-500">Feed</button>
          <button onClick={() => navigate(`/users/${user?.id}`)} className="text-blue-500">My Profile</button>
          <button onClick={() => navigate('/ai/resume-analyzer')} className="text-blue-500">Resume</button>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500">Logout</button>
        </div>
      </div>

      {/* PostForm */}
      {/* 🔑 onPostAdded now calls the user-specific fetch function */}
      <PostForm onPostAdded={fetchUserPosts} />

      {/* Post List */}
      <div className="space-y-4 mt-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
                key={post.id} 
                post={post} 
                // 🔑 onUpdated handles edit AND delete, refreshing the user's list
                onUpdated={fetchUserPosts} 
            />
          ))
        ) : (
            // Updated empty state message
          <p className="text-center text-gray-500 p-4 border rounded-lg bg-gray-50">You haven't posted anything yet. Share your thoughts!</p>
        )}
      </div>
    </div>
  );
}


