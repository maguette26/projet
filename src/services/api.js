import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.157:9191/api', // baseURL générale pour tout le backend
  headers: {
    'Content-Type': 'application/json',
  },
});;

// Intercepteur pour ajouter automatiquement le token JWT dans les headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
