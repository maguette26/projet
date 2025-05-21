import api from './api';

// Citations (déjà fait)
export const getCitations = async () => {
  const response = await api.get('/admin/citations');
  return response.data;
};

export const publierCitation = async (citationData) => {
  const response = await api.post('/admin/citations', citationData);
  return response.data;
};

export const supprimerCitation = async (id) => {
  const response = await api.delete(`/admin/citations/${id}`);
  return response.data;
};

// Ressources éducatives
export const getRessources = async () => {
  const response = await api.get('/admin/ressources');
  return response.data;
};

export const ajouterRessource = async (ressourceData) => {
  const response = await api.post('/admin/ressources', ressourceData);
  return response.data;
};

export const modifierRessource = async (id, ressourceData) => {
  const response = await api.put(`/admin/ressources/${id}`, ressourceData);
  return response.data;
};

export const supprimerRessource = async (id) => {
  const response = await api.delete(`/admin/ressources/${id}`);
  return response.data;
};


// Discussions forum
export const getDiscussions = async () => {
  const response = await api.get('/admin/forum/messages');
  return response.data;
};

export const supprimerDiscussion = async (id) => {
  const response = await api.delete(`/admin/forum/messages/${id}`);
  return response.data;
};

// Messages privés / messagerie
export const getMessagesPrives = async () => {
  const response = await api.get('/admin/messagerie/messages');
  return response.data;
};

export const supprimerMessagePrive = async (id) => {
  const response = await api.delete(`/admin/messagerie/messages/${id}`);
  return response.data;
};
