import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { getPosts } from '../api/post'; 

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const data = await getPosts();
    console.log("Fetched posts:", data); // add this line
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <PostForm onPostAdded={fetchPosts} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdated={fetchPosts} />
        ))}
      </div>
    </div>
  );
}
