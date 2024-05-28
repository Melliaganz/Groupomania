import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://groupomaniabacklucas-41ce31adf42c.herokuapp.com', // Backend URL
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