// src/components/commun/Header.jsx
import React, { useState, useEffect } from 'react'; // <-- Assurez-vous que useState et useEffect sont importés
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';

const Header = () => {
    const navigate = useNavigate();
    // 1. Utilisez un état local pour stocker le rôle de l'utilisateur.
    //    Il est initialisé avec la valeur actuelle du localStorage.
    const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

    // 2. Utilisez useEffect pour écouter les changements dans localStorage.
    //    Cela permet au composant de se re-rendre et d'adapter sa navigation
    //    si le 'role' change, même si cette modification vient d'ailleurs (ex: déconnexion).
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedRole = localStorage.getItem('role');
            // Mettre à jour l'état du composant avec la nouvelle valeur du rôle
            setCurrentRole(updatedRole);

            // Optionnel mais recommandé : si le rôle est effacé (utilisateur déconnecté),
            // redirigez vers la page de connexion pour une meilleure expérience utilisateur.
            if (!updatedRole) {
                console.log("Rôle non trouvé dans localStorage, redirection vers /connexion.");
                navigate('/connexion');
            }
        };

        // Ajoutez un écouteur pour l'événement 'storage'. Cet événement se déclenche
        // lorsque localStorage est modifié par un autre onglet/fenêtre du même domaine.
        window.addEventListener('storage', handleStorageChange);

        // Au montage du composant, assurez-vous que l'état 'currentRole' est synchronisé
        // avec la valeur actuelle du localStorage (utile si le composant est monté après une connexion).
        setCurrentRole(localStorage.getItem('role'));

        // Fonction de nettoyage : très important pour retirer l'écouteur d'événements
        // lorsque le composant est démonté, afin d'éviter les fuites de mémoire.
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]); // 'navigate' est inclus comme dépendance car il est utilisé dans l'effet.

    const handleDeconnexion = async () => {
        console.log("handleDeconnexion: Tentative de déconnexion..."); // Debugging log
        try {
            await logout(); // Appel de la fonction de déconnexion du service
            // Si la déconnexion réussit et que 'logout()' vide 'localStorage.role',
            // le `useEffect` ci-dessus détectera ce changement et mettra à jour 'currentRole'
            // et gérera la navigation vers '/connexion'.
            console.log("handleDeconnexion: Appel à logout terminé."); // Debugging log
        } catch (error) {
            // Afficher l'erreur détaillée dans la console.
            console.error("handleDeconnexion: Erreur lors de la déconnexion:", error);
            // Gérer l'erreur pour l'utilisateur (par exemple, afficher un message d'erreur à l'écran)
            // ex: alert("Erreur lors de la déconnexion. Veuillez réessayer.");
            // Si c'est une "Network Error", la déconnexion n'a pas pu être envoyée au backend.
        }
    };

    const isProfessional = (userRole) => {
        return userRole === 'PSYCHIATRE' || userRole === 'PSYCHOLOGUE';
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                    PsyConnect
                </Link>

                {/* Navigation principale */}
                <nav className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
                    <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
                    <Link to="/ressources" className="hover:text-indigo-600 transition">Ressources</Link>
                    <Link to="/forum" className="hover:text-indigo-600 transition">Forum</Link>

                    {/* Utilisation de 'currentRole' pour le rendu conditionnel */}
                    {currentRole ? (
                        <>
                            {currentRole === 'UTILISATEUR' && (
                                <Link to="/tableauUtilisateur" className="hover:text-indigo-600 transition">Espace Utilisateur</Link>
                            )}
                            {isProfessional(currentRole) && (
                                <Link to="/tableauProfessionnel" className="hover:text-indigo-600 transition">Espace Pro</Link>
                            )}

                            <button
                                onClick={handleDeconnexion}
                                className="ml-4 text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/connexion" className="hover:text-indigo-600 transition">Connexion</Link>
                            <Link to="/inscription" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition ml-2"> Inscription </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;