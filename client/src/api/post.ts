import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
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

// 🔑 UPDATED: Allows 'data' to be either a simple object or FormData
type PostData = { content: string } | FormData; 

export const createPost = async (data: PostData) => {
    let headers = {};
    
    // Check if the data is a standard JSON object or FormData
    if (!(data instanceof FormData)) {
        // If it's a standard object (text-only post), explicitly set JSON content type
        headers = { 'Content-Type': 'application/json' };
    } 
    // If it's FormData (contains a file), DO NOT set the Content-Type header. 
    // The browser automatically sets it to 'multipart/form-data' with the correct boundary.

    const res = await API.post('/posts', data, { headers });
    return res.data;
};

export const deletePost = async (id: string) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};



// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',  // adjust if needed
// });

// // Automatically attach token if logged in
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const getPosts = async () => {
//   const res = await API.get('/posts');
//   return res.data;
// };

// export const createPost = async (data: { content: string }) => {
//   const res = await API.post('/posts', data);
//   return res.data;
// };

// export const deletePost = async (id: string) => {
//   const res = await API.delete(`/posts/${id}`);
//   return res.data;
// };
