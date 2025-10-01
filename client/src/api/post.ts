import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',  // adjust if needed
});

// Automatically attach token if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = async () => {
  const res = await API.get('/posts');
  return res.data;
};

export const createPost = async (data: { content: string }) => {
  const res = await API.post('/posts', data);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};
