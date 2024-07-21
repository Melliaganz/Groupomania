import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://groupomania-kc47.onrender.com/api', // Corrected base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
