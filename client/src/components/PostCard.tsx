import FollowButton from './FollowButton';
import CommentList from './CommentList';
import { summarizeComments } from '../api/ai';

export default function PostCard({
  post,
  onUpdated,
}: {
  post: any;
  onUpdated: () => void;
}) {
  const handleSummarize = async () => {
    try {
      const res = await summarizeComments(post.id);
      alert('🧠 Summary:\n\n' + res.summary); // ✅ fix here
      onUpdated();
    } catch (err) {
      alert('❌ Failed to summarize comments');
    }
  };

  const authorName = post.user?.name || 'Unknown User';
  const authorId = post.user?.id || '';

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      {/* Post Header: Author + Follow */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="font-semibold">{authorName}</p>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {authorId && <FollowButton userId={authorId} />}
      </div>

      {/* Post Content */}
      <p className="mb-2">{post.content}</p>

      {/* Comments */}
      <CommentList postId={post.id} />

      {/* AI Summarize Button */}
      <button
        onClick={handleSummarize}
        className="text-sm text-blue-500 mt-2 hover:underline"
      >
        🧠 Summarize Discussion
      </button>
    </div>
  );
}
