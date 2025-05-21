import api from './api';

// Disponibilités
export const getDisponibilites = async () => {
  const response = await api.get('/professionnel/disponibilites');
  return response.data;
};

export const ajouterDisponibilite = async (dispoData) => {
  const response = await api.post('/professionnel/disponibilites', dispoData);
  return response.data;
};

export const modifierDisponibilite = async (id, dispoData) => {
  const response = await api.put(`/professionnel/disponibilites/${id}`, dispoData);
  return response.data;
};

export const supprimerDisponibilite = async (id) => {
  const response = await api.delete(`/professionnel/disponibilites/${id}`);
  return response.data;
};

// Consultations
export const getConsultations = async () => {
  const response = await api.get('/professionnel/consultations');
  return response.data;
};

export const modifierConsultation = async (id, consultationData) => {
  const response = await api.put(`/professionnel/consultations/${id}`, consultationData);
  return response.data;
};

// Réservations (consultations réservées par les utilisateurs)
export const getReservations = async () => {
  const response = await api.get('/professionnel/reservations');
  return response.data;
};

// Messagerie
export const envoyerMessage = async (messageData) => {
  const response = await api.post('/professionnel/messages', messageData);
  return response.data;
};

export const getMessages = async () => {
  const response = await api.get('/professionnel/messages');
  return response.data;
};
