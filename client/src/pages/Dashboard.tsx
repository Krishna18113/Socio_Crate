import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';
import { getPosts } from '../api/post';

export default function Dashboard() {
  const { user, logout } = useAuth()!;
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const res = await getPosts();
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
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
      <PostForm onPostAdded={fetchPosts} />

      {/* Post List */}
      <div className="space-y-4 mt-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdated={fetchPosts} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}
