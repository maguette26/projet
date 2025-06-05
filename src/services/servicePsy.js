// src/services/serviceProfessionnel.js
import api from './api'; // Cette instance 'api' est configurée avec `baseURL: '/api'`

// Disponibilités
export const getDisponibilites = async () => {
  // Le chemin doit être SANS le préfixe '/api' ici, car il est déjà dans la baseURL
  const response = await api.get('/disponibilites'); // <-- TRÈS IMPORTANT : CORRIGÉ ICI
  return response.data;
};

export const ajouterDisponibilite = async (dispoData) => {
  const response = await api.post('/disponibilites', dispoData); // <-- CORRIGÉ ICI
  return response.data;
};

export const modifierDisponibilite = async (id, dispoData) => {
  const response = await api.put(`/disponibilites/${id}`, dispoData); // <-- CORRIGÉ ICI
  return response.data;
};

export const supprimerDisponibilite = async (id) => {
  const response = await api.delete(`/disponibilites/${id}`); // <-- CORRIGÉ ICI
  return response.data;
};

// Vérifiez aussi les autres fonctions si elles sont utilisées pour les appels au backend
// et assurez-vous qu'elles n'ont pas de double '/api' si la baseURL s'applique.
// Par exemple pour les consultations, réservations, messages :
export const getConsultations = async () => {
  const response = await api.get('/professionnel/consultations'); // Ceci deviendra '/api/professionnel/consultations'
  return response.data;
};

export const modifierConsultation = async (id, consultationData) => {
  const response = await api.put(`/professionnel/consultations/${id}`, consultationData);
  return response.data;
};

export const getReservations = async () => {
  const response = await api.get('/professionnel/reservations');
  return response.data;
};

export const envoyerMessage = async (messageData) => {
  const response = await api.post('/professionnel/messages', messageData);
  return response.data;
};

export const getMessages = async () => {
  const response = await api.get('/professionnel/messages');
  return response.data;
};