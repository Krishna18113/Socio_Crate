import { useState } from 'react';
import { createPost } from '../api/post';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router

export default function PostForm({ onPostAdded }: { onPostAdded: () => void }) {
  const { user } = useAuth()!;
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    await createPost({ content });
    setContent('');
    onPostAdded();
  };

  if (!user) {
    return (
      <div className="mb-4 flex items-center space-x-3">
        <p className="text-gray-600 text-sm">Please log in to create a post.</p>
        <button
          onClick={() => navigate('/login')}
          className="text-blue-500 text-sm underline hover:text-blue-700"
        >
          Login
        </button>
        <p className="text-gray-600 text-sm"> / </p>
        <button
          onClick={() => navigate('/register')}
          className="text-blue-500 text-sm underline hover:text-blue-700"
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </div>
  );
}
