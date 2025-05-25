import api from './api';

// Connexion
export const login = async (email, motDePasse) => {
  const response = await axios.post('http://192.168.1.157:9191/api/auth/login', {
    email,
    motDePasse
  });
  return response.data;
};
// Inscription
export const register = async (userData) => {
  const response = await api.post('/auth/inscription', userData);
  return response.data;
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token');
};

// Profil utilisateur connecté
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
