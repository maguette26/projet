// src/components/utilisateur/FormulaireProfil.jsx
import React, { useState, useEffect } from 'react';
import { getProfil, modifierProfil } from '../../services/serviceUtilisateur';

// FormulaireProfil reçoit isAuthenticated et currentUserEmail comme props
const FormulaireProfil = ({ isAuthenticated, currentUserEmail }) => {
    // Initialise profil avec les informations connues (email) et un ID null
    const [profil, setProfil] = useState({ nom: '', prenom: '', email: currentUserEmail || '', telephone: '', id: null });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Met à jour l'email si currentUserEmail change (par exemple, après une connexion)
    useEffect(() => {
        setProfil(prev => ({ ...prev, email: currentUserEmail || '' }));
    }, [currentUserEmail]);


    useEffect(() => {
        const chargerProfil = async () => {
            setError('');
            setMessage('');

            if (!isAuthenticated || !currentUserEmail) {
                setError("Vous devez être connecté pour voir ou modifier votre profil.");
                setLoading(false);
                return;
            }

            try {
                // Cet appel à getProfil() utilise /api/auth/me qui renvoie {email, role, authenticated} mais PAS 'id'
                const profilData = await getProfil(); 
                console.log("Données de profil de /api/auth/me:", profilData);

                // Initialise un objet pour les données du profil
                let fetchedProfil = { 
                    nom: profilData.nom || '', 
                    prenom: profilData.prenom || '', 
                    email: profilData.email || currentUserEmail || '', 
                    telephone: profilData.telephone || '', 
                    id: null 
                };

                // Vérifie si l'ID est renvoyé par le backend dans la réponse /api/auth/me
                // (Ce qui n'est PAS le cas actuellement selon vos consoles)
                if (profilData && profilData.id) { 
                    fetchedProfil.id = profilData.id;
                } else {
                    // Si l'ID est manquant du backend, affiche un message d'erreur
                    setError("Impossible de récupérer l'ID de votre profil depuis le backend. La modification de profil ne sera pas fonctionnelle.");
                    console.warn("L'ID utilisateur est manquant dans la réponse de /api/auth/me. La modification du profil nécessitera l'ID.");
                }

                setProfil(fetchedProfil);

            } catch (err) {
                console.error("Erreur lors du chargement du profil:", err);
                setError("Erreur lors du chargement du profil. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        chargerProfil();
    }, [isAuthenticated, currentUserEmail]); // Recharge si l'état d'authentification ou l'email change


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfil(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!isAuthenticated) {
            setError("Vous devez être connecté pour modifier votre profil.");
            return;
        }

        // Le bouton est désactivé si profil.id est null, mais cette vérification est ajoutée pour la clarté
        if (!profil.id) {
            setError("Impossible de modifier le profil : ID utilisateur non disponible. Veuillez contacter le support.");
            return;
        }

        try {
            // Appelle la fonction modifierProfil avec l'objet profil (qui doit contenir l'ID)
            await modifierProfil(profil);
            setMessage('Profil mis à jour avec succès !');
        } catch (err) {
            console.error("Erreur lors de la mise à jour du profil :", err);
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil.");
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-600">Chargement du profil...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative text-center">
                Veuillez vous connecter pour gérer votre profil.
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        name="nom"
                        id="nom"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={profil.nom}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        type="text"
                        name="prenom"
                        id="prenom"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={profil.prenom}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 cursor-not-allowed"
                        value={profil.email}
                        readOnly 
                    />
                </div>
                <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                        type="tel"
                        name="telephone"
                        id="telephone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={profil.telephone}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!profil.id} // Désactive si l'ID n'est pas disponible
                >
                    Enregistrer les modifications
                </button>
            </form>
        </div>
    );
};

export default FormulaireProfil;
