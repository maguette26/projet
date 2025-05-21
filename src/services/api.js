import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9094/api/auth/login', 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Intercepteur JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
