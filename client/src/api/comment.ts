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

export const getComments = async (postId: string) => {
  const res = await API.get(`/posts/${postId}/comments`);
  return res.data;
};

export const createComment = async (postId: string, content: string) => {
  const res = await API.post(`/posts/${postId}/comments`, { content });
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await API.delete(`/comments/${commentId}`);
  return res.data;
};

