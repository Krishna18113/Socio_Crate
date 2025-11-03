import axios from "axios";

// Use backend URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach JWT token if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register User
export const registerUser = (data: { name: string; email: string; password: string }) => {
  return axiosInstance.post("/auth/register", data);
};

// Login User
export const loginUser = (data: { email: string; password: string }) => {
  return axiosInstance.post("/auth/login", data);
};
