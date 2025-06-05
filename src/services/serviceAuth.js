// src/services/serviceAuth.js
import api from './api'; // Importe l'instance 'api' centralisée

export const login = async (email, motDePasse) => {
    console.log(`serviceAuth: Tentative de connexion pour ${email} vers ${api.defaults.baseURL}/auth/login`);
    try {
        const response = await api.post('/auth/login', { email, motDePasse });
        console.log("serviceAuth: Connexion réussie, réponse du backend:", response.data);

        // --- PARTIE À AJOUTER OU MODIFIER ---
        // Assurez-vous que votre backend renvoie le rôle dans `response.data.role`
        if (response.data && response.data.role) {
            const backendRole = response.data.role; // Ex: "ROLE_ADMIN", "ROLE_USER"
            // Nettoyer le rôle si nécessaire (retirer le préfixe "ROLE_")
            const cleanedRole = backendRole.startsWith('ROLE_') ? backendRole.substring(5) : backendRole;
            localStorage.setItem('role', cleanedRole); // <-- C'est la ligne clé !
            console.log(`serviceAuth: Rôle '${cleanedRole}' stocké dans localStorage.`);
        } else {
            console.warn("serviceAuth: La réponse de connexion du backend ne contient pas de rôle.");
            // Gérer ce cas si le rôle n'est pas toujours renvoyé
            // Par exemple, vous pourriez vouloir déconnecter l'utilisateur ou le rediriger.
        }
        // --- FIN DE LA PARTIE À AJOUTER OU MODIFIER ---

        return response.data; // Retourne les données complètes de la réponse du backend
    } catch (error) {
        console.error("serviceAuth: Erreur de connexion:", error.response ? error.response.data : error.message, error);
        throw error;
    }
};

export const logout = async () => {
    console.log(`serviceAuth: Tentative de déconnexion vers ${api.defaults.baseURL}/auth/logout`);
    try {
        await api.post('/auth/logout');
        console.log("serviceAuth: Requête de déconnexion envoyée avec succès au backend.");

        localStorage.removeItem('role'); // Correct : supprime le rôle lors de la déconnexion
        console.log("serviceAuth: 'role' supprimé de localStorage.");

    } catch (error) {
        console.error("serviceAuth: Erreur de déconnexion:", error.response ? error.response.data : error.message, error);
        // En cas d'erreur de déconnexion du backend, il est toujours sage de nettoyer le localstorage
        localStorage.removeItem('role');
        console.log("serviceAuth: 'role' supprimé de localStorage même en cas d'erreur de requête.");
        throw error;
    }
};