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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-2xl mx-auto mt-6 px-4 bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Feed 📰</h1>
        <PostForm onPostAdded={fetchPosts} />
        <div className="space-y-4 mt-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdated={fetchPosts} />
          ))}
        </div>
      </div>
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import PostCard from '../components/PostCard';
// import PostForm from '../components/PostForm';
// import { getPosts } from '../api/post'; 

// export default function FeedPage() {
//   const [posts, setPosts] = useState<any[]>([]);

//   const fetchPosts = async () => {
//     const data = await getPosts();
//     console.log("Fetched posts:", data); // add this line
//     setPosts(data);
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto mt-6 px-4">
//       <PostForm onPostAdded={fetchPosts} />
//       <div className="space-y-4">
//         {posts.map((post) => (
//           <PostCard key={post.id} post={post} onUpdated={fetchPosts} />
//         ))}
//       </div>
//     </div>
//   );
// }
