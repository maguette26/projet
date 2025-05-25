import api from './api'; // Assurez-vous que c'est bien l'instance d'Axios configurée avec le token JWT

// Citations
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

// **********************************************
// NOUVELLES FONCTIONS POUR LA GESTION DES UTILISATEURS (Basées sur votre UtilisateurController)
// **********************************************

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  const response = await api.get('/utilisateurs'); // <-- Endpoint qui correspond à votre Spring Boot /api/utilisateurs
  return response.data;
};

// Récupérer un utilisateur par ID
export const getUserById = async (userId) => {
    const response = await api.get(`/utilisateurs/${userId}`); // <-- Endpoint qui correspond
    return response.data;
};

// Mettre à jour un utilisateur (y compris son rôle)
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/utilisateurs/${userId}`, userData); // <-- Endpoint qui correspond
  return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (userId) => {
  const response = await api.delete(`/utilisateurs/${userId}`); // <-- Endpoint qui correspond
  return response.data;
};