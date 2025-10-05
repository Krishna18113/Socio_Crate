import { useEffect, useState } from 'react';
import { getComments, deleteComment } from '../api/comment';
import CommentForm from './CommentForm';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchComments = () => {
    getComments(postId).then(setComments);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this comment?');
    if (!confirm) return;
    try {
      await deleteComment(commentId);
      toast.success('🗑️ Comment deleted');
      fetchComments();
    } catch (err) {
      toast.error('❌ Failed to delete comment');
    }
  };

  return (
    <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
      {comments.map(comment => (
        <div
          key={comment.id}
          className="flex justify-between items-start bg-gray-50 p-2 rounded-lg shadow-sm"
        >
          <p className="text-sm text-gray-800">
            <span className="font-medium text-gray-900">{comment.user.name || 'Guest User'}</span>: {comment.content}
          </p>
          {user?.id === comment.user.id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-xs text-red-500 hover:text-red-700 hover:underline ml-2 flex-shrink-0"
            >
              Delete
            </button>
          )}
        </div>
      ))}
      <div className="mt-2">
        <CommentForm postId={postId} onCommented={fetchComments} />
      </div>
    </div>
  );
}




// import { useEffect, useState } from 'react';
// import { getComments, deleteComment } from '../api/comment';
// import CommentForm from './CommentForm';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// export default function CommentList({ postId }: { postId: string }) {
//   const [comments, setComments] = useState<any[]>([]);
//   const { user } = useAuth();

//   const fetchComments = () => {
//     getComments(postId).then(setComments);
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   const handleDelete = async (commentId: string) => {
//     const confirm = window.confirm('Are you sure you want to delete this comment?');
//     if (!confirm) return;
//     try {
//       await deleteComment(commentId);
//       toast.success('🗑️ Comment deleted');
//       fetchComments();
//     } catch (err) {
//       toast.error('❌ Failed to delete comment');
//     }
//   };

//   return (
//     <div className="mt-3 border-t pt-2">
//       {comments.map(comment => (
//         <div key={comment.id} className="mb-1 flex justify-between items-center">
//           <p className="text-sm">
//             <span className="font-medium">{comment.user.name || 'Guest User'}</span>: {comment.content}
//           </p>
//           {user?.id === comment.user.id && (
//             <button
//               onClick={() => handleDelete(comment.id)}
//               className="text-xs text-red-500 hover:underline"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       ))}
//       <CommentForm postId={postId} onCommented={fetchComments} />
//     </div>
//   );
// }
