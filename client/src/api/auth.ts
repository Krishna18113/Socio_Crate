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

export const registerUser = (data: { name: string; email: string; password: string }) => {
  return axios.post('/auth/register', data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return axios.post('/auth/login', data);
};
