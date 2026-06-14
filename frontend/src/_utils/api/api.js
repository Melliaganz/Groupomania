import axios from 'axios';

// URL de l'API : configurable via la variable d'env VITE_API_URL.
// Defaut : backend local en developpement.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create an instance of axios
const api = axios.create({
  baseURL,
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
