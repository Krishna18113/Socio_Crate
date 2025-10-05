import { useEffect, useState } from 'react';
import { followUser, unfollowUser, getFollowers } from '../api/follow';

interface FollowButtonProps {
  userId: string; // ID of the profile being viewed
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const currentUserId = localStorage.getItem('userId');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!currentUserId || currentUserId === userId) return null;

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const followers = await getFollowers(userId);
        const isUserFollowing = followers.some(
          (follower: { id: string }) => follower.id === currentUserId
        );
        setIsFollowing(isUserFollowing);
      } catch (err) {
        console.error('Error checking follow status', err);
      }
    };

    checkIfFollowing();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await followUser(userId);
      setIsFollowing(true);
    } catch (err) {
      console.error('Follow failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      await unfollowUser(userId);
      setIsFollowing(false);
    } catch (err) {
      console.error('Unfollow failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={loading}
      className={`relative px-5 py-2.5 rounded-full font-medium text-sm shadow-md transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          isFollowing
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 focus:ring-blue-400'
        }
        ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-[0.97]'}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </button>
  );
}


