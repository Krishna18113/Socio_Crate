import { useEffect, useState } from 'react';
import { followUser, unfollowUser, getFollowers } from '../api/follow';

interface FollowButtonProps {
  userId: string; // ID of the profile being viewed
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const currentUserId = localStorage.getItem('userId');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Early return if user is not logged in or viewing their own profile
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
      className={`px-4 py-2 rounded transition-opacity duration-150 ${
        isFollowing ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
