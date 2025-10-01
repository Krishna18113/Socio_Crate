import axios from 'axios';

export const registerUser = (data: { name: string; email: string; password: string }) => {
  return axios.post('/api/auth/register', data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return axios.post('/api/auth/login', data);
};
