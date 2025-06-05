// src/services/api.js
import axios from 'axios';

// La baseURL est maintenant simplement '/api', car le proxy du serveur de développement
// va rediriger toutes les requêtes commençant par '/api' vers votre backend.
const API_BASE_URL = '/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Permet d'envoyer le cookie JSESSIONID avec les requêtes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs de session / déconnexion automatique
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée ou non autorisée, redirection vers la page de connexion...");
      localStorage.removeItem('role'); // Nettoyer le rôle côté client
      window.location.href = '/connexion'; // Redirige l'utilisateur
    }
    return Promise.reject(error);
  }
);

export default api;
