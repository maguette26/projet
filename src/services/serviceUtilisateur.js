// src/services/serviceUtilisateur.js
import api from './api';

// Suivi d’humeur
export const getSuiviHumeur = async (userId) => {
  // Le chemin correct pour récupérer les humeurs d'un utilisateur spécifique.
  // Assurez-vous que votre backend a bien un @GetMapping("/utilisateur/{utilisateurId}") dans HumeurController.
  const response = await api.get(`/humeurs/utilisateur/${userId}`);
  return response.data;
};

export const ajouterHumeur = async (humeurData) => {
  // Le chemin correct pour ajouter une humeur (HumeurController @PostMapping "/")
  const response = await api.post('/humeurs', humeurData);
  return response.data;
};

// Profil (UTILISÉ pour récupérer l'ID de l'utilisateur connecté, même si la modification n'est pas implémentée)
export const getProfil = async () => {
  // Ceci appelle l'endpoint Spring Security qui donne les détails de l'utilisateur authentifié.
  // Assurez-vous que cet endpoint existe et renvoie un objet avec un 'id'.
  const response = await api.get('/auth/me');
  return response.data;
};

export const modifierProfil = async (profilData) => {
  // Cette fonction est ici pour complétude, mais ne sera pas fonctionnelle
  // tant que le backend n'a pas implémenté la logique de modification pour PUT /api/utilisateurs/{id}.
  if (!profilData || !profilData.id) {
    throw new Error("ID de l'utilisateur manquant pour la modification du profil.");
  }
  const response = await api.put(`/utilisateurs/${profilData.id}`, profilData);
  return response.data;
};

// Consultations
export const reserverConsultation = async (consultationData) => {
  // Conservez ce chemin tel quel, en supposant qu'il correspond à votre backend
  const response = await api.post('/utilisateur/consultations', consultationData);
  return response.data;
};
