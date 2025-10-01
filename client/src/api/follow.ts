import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Correct URL: POST /follow/:id
export const followUser = async (id: string) => {
  const res = await API.post(`/follow/${id}/follow`);
  return res.data;
};

// ✅ Correct URL: POST /follow/:id/unfollow
export const unfollowUser = async (id: string) => {
  const res = await API.post(`/follow/${id}/unfollow`);
  return res.data;
};

// ✅ Optional: Check follow status (if backend supports it)
export const isFollowingUser = async (id: string) => {
  const res = await API.get(`/follow/${id}/status`);
  return res.data.isFollowing;
};

// ✅ FIXED URL
export const getFollowers = async (id: string) => {
  const res = await API.get(`/follow/${id}/followers`);
  return res.data;
};

// ✅ FIXED URL
export const getFollowing = async (id: string) => {
  const res = await API.get(`/follow/${id}/following`);
  return res.data;
};
