import FollowButton from './FollowButton';
import CommentList from './CommentList';
import { summarizeComments } from '../api/ai';

const SERVER_URL = "http://localhost:5000"; // ASSUMPTION: Define your server URL base (adjust if different)

// 🔑 NEW Helper: Renders an individual media item with correct styling and interactivity
const MediaItem = ({ media }: { media: any }) => {
    const fullUrl = `${SERVER_URL}${media.url}`;

    // Common container styling to set size limits
    const mediaContainerClasses = "w-full h-full max-h-96 rounded-lg bg-gray-100 flex items-center justify-center";
    // Common media styling to prevent cropping
    const mediaStyleClasses = "max-h-96 w-full object-contain";

    if (media.type === 'image') {
        return (
            // 🔑 FIX 1 & 2: Wrap image in <a> to allow enlarging/opening in a new tab
            <a href={fullUrl} target="_blank" rel="noopener noreferrer" className={mediaContainerClasses}>
                <img
                    src={fullUrl}
                    alt="Post Media"
                    // 🔑 FIX 3: Use object-contain to ensure the whole image is visible
                    className={`${mediaStyleClasses} cursor-pointer hover:opacity-90 transition`}
                />
            </a>
        );
    }

    if (media.type === 'video') {
        return (
            <div className={mediaContainerClasses}>
                <video
                    controls
                    src={fullUrl}
                    // 🔑 FIX 3: Use object-contain for video as well
                    className={mediaStyleClasses}
                />
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
      // NOTE: Using a custom modal instead of alert is recommended for better UX
      alert('🧠 Summary:\n\n' + res.summary); 
      onUpdated();
    } catch (err) {
      alert('❌ Failed to summarize comments');
    }
  };

  const authorName = post.user?.name || 'Unknown User';
  const authorId = post.user?.id || '';
  
  // Access the whole files array
  const mediaFiles = post.files || [];

  return (
    <div className="border rounded-xl p-4 shadow-lg bg-white">
      {/* Post Header: Author + Follow */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="font-bold text-gray-800">{authorName}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {authorId && <FollowButton userId={authorId} />}
      </div>

      {/* Post Content */}
      {post.content && <p className="mb-3 text-gray-700 whitespace-pre-wrap">{post.content}</p>}

      {/* 🔑 UPDATED: Multi-Media Display Container */}
      {mediaFiles.length > 0 && (
        // 🔑 Updated grid layout for multiple files
        <div className={`mb-4 grid gap-2 ${mediaFiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {mediaFiles.map((media: any) => (
            // 🔑 Render each media item using the new helper component
            <MediaItem key={media.id} media={media} />
          ))}
        </div>
      )}
      {/* END Media Display */}

      {/* Comments */}
      <CommentList postId={post.id} />

      {/* AI Summarize Button */}
      <button
        onClick={handleSummarize}
        className="text-sm text-blue-500 mt-2 hover:underline font-medium"
      >
        🧠 Summarize Discussion
      </button>
    </div>
  );
}





// import FollowButton from './FollowButton';
// import CommentList from './CommentList';
// import { summarizeComments } from '../api/ai';

// export default function PostCard({
//   post,
//   onUpdated,
// }: {
//   post: any;
//   onUpdated: () => void;
// }) {
//   const handleSummarize = async () => {
//     try {
//       const res = await summarizeComments(post.id);
//       alert('🧠 Summary:\n\n' + res.summary); // ✅ fix here
//       onUpdated();
//     } catch (err) {
//       alert('❌ Failed to summarize comments');
//     }
//   };

//   const authorName = post.user?.name || 'Unknown User';
//   const authorId = post.user?.id || '';

//   return (
//     <div className="border rounded p-4 shadow-sm bg-white">
//       {/* Post Header: Author + Follow */}
//       <div className="flex justify-between items-center mb-2">
//         <div>
//           <p className="font-semibold">{authorName}</p>
//           <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
//         </div>
//         {authorId && <FollowButton userId={authorId} />}
//       </div>

//       {/* Post Content */}
//       <p className="mb-2">{post.content}</p>

//       {/* Comments */}
//       <CommentList postId={post.id} />

//       {/* AI Summarize Button */}
//       <button
//         onClick={handleSummarize}
//         className="text-sm text-blue-500 mt-2 hover:underline"
//       >
//         🧠 Summarize Discussion
//       </button>
//     </div>
//   );
// }
