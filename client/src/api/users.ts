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

export const getUserById = async (id: string) => {
  try {
    const response = await API.get(`/users/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const response = await API.get(`/follow/${userId}/followers`);
    return response;
  } catch (error) {
    console.error(`Error fetching followers of user ${userId}:`, error);
    throw error;
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const response = await API.get(`/follow/${userId}/following`);
    return response;
  } catch (error) {
    console.error(`Error fetching following list of user ${userId}:`, error);
    throw error;
  }
};

// --- NEW: Function to delete profile picture ---
export const deleteProfilePic = async () => {
  const res = await API.delete("/users/profile-pic"); // This calls your backend's DELETE route
  return res.data;
};