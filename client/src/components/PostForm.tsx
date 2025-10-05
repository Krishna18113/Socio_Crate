import { useState, useRef } from 'react';
import { createPost } from '../api/post';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PostForm({ onPostAdded }: { onPostAdded: () => void }) {
  const { user } = useAuth()!;
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (mediaFiles.length + newFiles.length > MAX_FILES) {
      alert(`You can only upload a maximum of ${MAX_FILES} media files.`);
      return;
    }
    setMediaFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFilePreviewUrl = (file: File) => URL.createObjectURL(file);

  const handleRemoveMedia = (indexToRemove: number) => {
    setMediaFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAllMedia = () => {
    setMediaFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    if (!user) return;

    const formData = new FormData();
    formData.append('content', content);
    mediaFiles.forEach((file) => formData.append('mediaFiles', file));

    try {
      await createPost(formData);
      setContent('');
      handleClearAllMedia();
      onPostAdded();
    } catch (error) {
      console.error('Post creation failed:', error);
      alert('Failed to create post. Check file size/type limits or server connectivity.');
    }
  };

  if (!user) {
    return (
      <div className="mb-4 flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
        <p className="text-gray-700 text-sm">Please log in to create a post.</p>
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Login
        </button>
        <span className="text-gray-500">/</span>
        <button
          onClick={() => navigate('/register')}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 border border-gray-200 p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Textarea */}
      <textarea
        className="w-full border border-gray-300 rounded-xl p-3 resize-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
        rows={3}
        placeholder="💭 What's on your mind? Add an image or video below!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="mt-4 p-3 border rounded-xl bg-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaFiles.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 group"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={getFilePreviewUrl(file)}
                  alt="Preview"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
              ) : (
                <video
                  src={getFilePreviewUrl(file)}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => handleRemoveMedia(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100 hover:scale-110 transition"
                aria-label="Remove media"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Input + Post Button */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
        <label
          className={`cursor-pointer text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all duration-150 ${
            mediaFiles.length >= MAX_FILES
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-100 hover:bg-green-200 text-green-700'
          }`}
        >
          <span>🖼️ Add Media ({mediaFiles.length}/{MAX_FILES})</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            multiple
            disabled={mediaFiles.length >= MAX_FILES}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() && mediaFiles.length === 0}
          className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
            !content.trim() && mediaFiles.length === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
}



