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

export const summarizeComments = async (postId: string) =>{
  const res=await API.post('/ai/summarize', { postId });
  return res.data;
};

export const suggestReply = async (postId: string) =>{
  const res=await API.post('/ai/suggest', { postId });
  return res.data;
};

// NEW function for Resume/Portfolio Analysis
export const analyzeResume = async (formData: FormData) => {
  const res = await API.post('/ai/analyze-resume', formData, {
    headers: {
      // Crucial for file uploads via FormData
      'Content-Type': 'multipart/form-data', 
    },
  });
  return res.data;
};