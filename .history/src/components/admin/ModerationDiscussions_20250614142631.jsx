// services/serviceAdmin.js
const API_BASE_URL = 'http://localhost:8080/api'; // adapte selon ton backend

export async function getDiscussions() {
  const response = await fetch(`${API_BASE_URL}/forum/admin/tous`, {
    credentials: 'include', // si tu utilises cookies pour l'auth
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des discussions');
  }
  return await response.json();
}

export async function getMessagesPrives() {
  const response = await fetch(`${API_BASE_URL}/admin/tous`, { // adapte si ta route privée est différente
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des messages privés');
  }
  return await response.json();
}

export async function supprimerDiscussion(id) {
  const response = await fetch(`${API_BASE_URL}/forum/sujets/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la discussion');
  }
}

export async function supprimerMessagePrive(id) {
  const response = await fetch(`${API_BASE_URL}/admin/message/${id}`, { // adapte si nécessaire
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du message privé');
  }
}
