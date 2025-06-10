// src/services/serviceUtilisateur.js
import api from './api';

// Suivi d’humeur (utilisateur connecté via Spring Security, pas besoin d’ID)
export const getSuiviHumeur = async () => {
  const response = await api.get('/humeurs');  // GET humeurs de l'utilisateur connecté
  return response.data;
};

// Ajout d'humeur
export const ajouterHumeur = async (humeurData) => {
  const response = await api.post('/humeurs', humeurData);
  return response.data;
};

// Profil (récupère email, rôle, mais PAS ID)
export const getProfil = async () => {
  const response = await api.get('/auth/me'); 
  return response.data;
};

// Modifier profil (nécessite id)
export const modifierProfil = async (profilData) => {
  if (!profilData || !profilData.id) {
    throw new Error("ID de l'utilisateur manquant pour la modification du profil.");
  }
  const response = await api.put(`/utilisateurs/${profilData.id}`, profilData);
  return response.data;
};

// Consultations
export const reserverConsultation = async (consultationData) => {
  const response = await api.post('/utilisateur/consultations', consultationData);
  return response.data;
};

// Forum
export const getForumSujets = async () => {
  const response = await api.get('/forum/sujets');
  return response.data;
};

export const creerForumSujet = async (titre, contenu) => {
  const payload = { titre, contenu };
  const response = await api.post('/forum/sujets', payload);
  return response.data;
};

export const getForumReponses = async (sujetId) => {
  const response = await api.get(`/forum/sujets/reponses/${sujetId}`);
  return response.data;
};

export const envoyerForumReponse = async (sujetId, messageContenu) => {
  const payload = { message: messageContenu };
  const response = await api.post(`/forum/sujets/reponses/${sujetId}`, payload);
  return response.data;
};
