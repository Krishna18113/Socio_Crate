import FollowButton from './FollowButton';
import CommentList from './CommentList';
import { summarizeComments } from '../api/ai';

const SERVER_URL = "http://localhost:5000";

const MediaItem = ({ media }: { media: any }) => {
  const fullUrl = `${SERVER_URL}${media.url}`;
  const mediaContainerClasses =
    "w-full h-full max-h-96 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner";
  const mediaStyleClasses =
    "max-h-96 w-full object-contain transition-transform duration-300 hover:scale-[1.02]";

  if (media.type === 'image') {
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${mediaContainerClasses} group`}
      >
        <img
          src={fullUrl}
          alt="Post Media"
          className={`${mediaStyleClasses} cursor-pointer group-hover:opacity-90`}
        />
      </a>
    );
  }

  if (media.type === 'video') {
    return (
      <div className={mediaContainerClasses}>
        <video controls src={fullUrl} className={mediaStyleClasses} />
      </div>
    );
  }

  return null;
};

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
      alert('🧠 Summary:\n\n' + res.summary);
      onUpdated();
    } catch (err) {
      alert('❌ Failed to summarize comments');
    }
  };

  const authorName = post.user?.name || 'Unknown User';
  const authorId = post.user?.id || '';
  const mediaFiles = post.files || [];

  return (
    <div className="border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 transition-shadow duration-300">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-semibold text-gray-800 text-lg">{authorName}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        {authorId && <FollowButton userId={authorId} />}
      </div>

      {/* Post Content */}
      {post.content && (
        <p className="mb-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Media Display */}
      {mediaFiles.length > 0 && (
        <div
          className={`mb-4 grid gap-3 ${
            mediaFiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {mediaFiles.map((media: any) => (
            <MediaItem key={media.id} media={media} />
          ))}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-3">
        <CommentList postId={post.id} />
      </div>

      {/* AI Summarize Button */}
      <button
        onClick={handleSummarize}
        className="text-sm mt-3 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 hover:underline transition-colors"
      >
        🧠 Summarize Discussion
      </button>
    </div>
  );
}




