import { useState } from 'react';
import { createComment } from '../api/comment';
import { suggestReply } from '../api/ai';
import { useAuth } from '../context/AuthContext';

export default function CommentForm({
  postId,
  onCommented,
}: {
  postId: string;
  onCommented: () => void;
}) {
  const { user } = useAuth()!;
  const [text, setText] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await createComment(postId, text);
    setText('');
    onCommented();
  };

  const handleSuggest = async () => {
    setLoadingAI(true);
    try {
      const res = await suggestReply(postId);
      setText(res.suggestion);
    } catch (err: any) {
      console.error('Frontend Suggest Error:', err.response?.data || err.message || err);
      alert('❌ Failed to get AI suggestion');
    } finally {
      setLoadingAI(false);
    }
  };

  if (!user) {
    return (
      <p className="text-gray-500 text-sm italic">
        Log in to comment and use AI suggestions.
      </p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 w-full">
      <button
        onClick={handleSuggest}
        disabled={loadingAI}
        className={`text-sm px-3 py-1 rounded-lg font-medium shadow-sm transition-all duration-200 ${
          loadingAI
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-100 text-green-600 hover:bg-green-200'
        }`}
      >
        {loadingAI ? 'Loading...' : 'AI Suggest Reply'}
      </button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg font-medium shadow hover:bg-blue-600 transition w-full sm:w-auto"
      >
        Post
      </button>
    </div>
  );
}



// import { useState } from 'react';
// import { createComment } from '../api/comment';
// import { suggestReply } from '../api/ai';
// import { useAuth } from '../context/AuthContext'; // <-- Add this

// export default function CommentForm({
//   postId,
//   onCommented,
// }: {
//   postId: string;
//   onCommented: () => void;
// }) {
//   const { user } = useAuth()!;
//   const [text, setText] = useState('');
//   const [loadingAI, setLoadingAI] = useState(false);

//   const handleSubmit = async () => {
//     if (!text.trim()) return;
//     await createComment(postId, text);
//     setText('');
//     onCommented();
//   };

//   const handleSuggest = async () => {
//     setLoadingAI(true);
//     try {
//       const res = await suggestReply(postId);
//       setText(res.suggestion); // ✅ fix here
//     } //catch (err) {
//     //   alert('❌ Failed to get AI suggestion');
//     // }
//     catch (err: any) {
//   console.error('Frontend Suggest Error:', err.response?.data || err.message || err);
//   alert('❌ Failed to get AI suggestion');
// } finally {
//       setLoadingAI(false);
//     }
//   };
//   if (!user) {
//     return <p className="text-gray-500 text-sm italic">Log in to comment and use AI suggestions.</p>;
//   }

//   return (
//     <div className="flex mt-2 items-center space-x-2">
//       <button
//         onClick={handleSuggest}
//         disabled={loadingAI}
//         className={`text-sm px-2 py-1 rounded ${
//           loadingAI
//             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             : 'bg-green-100 text-green-600 hover:bg-green-200'
//         }`}
//       >
//         {loadingAI ? 'Loading...' : 'AI Suggest Reply'}
//       </button>

//       <input
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Add a comment..."
//         className="flex-1 border p-2 rounded text-sm"
//       />

//       <button
//         onClick={handleSubmit}
//         className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
//       >
//         Post
//       </button>
//     </div>
//   );
// }
