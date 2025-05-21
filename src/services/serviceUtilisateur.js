import api from './api';

// Suivi d’humeur
export const getSuiviHumeur = async () => {
  const response = await api.get('/utilisateur/suivi-humeur');
  return response.data;
};

export const ajouterHumeur = async (humeur) => {
  const response = await api.post('/utilisateur/suivi-humeur', { humeur });
  return response.data;
};

// Profil
export const getProfil = async () => {
  const response = await api.get('/utilisateur/profil');
  return response.data;
};

export const modifierProfil = async (profilData) => {
  const response = await api.put('/utilisateur/profil', profilData);
  return response.data;
};

// Consultations
export const reserverConsultation = async (consultationData) => {
  const response = await api.post('/utilisateur/consultations', consultationData);
  return response.data;
};
