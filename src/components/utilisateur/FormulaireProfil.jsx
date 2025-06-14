// src/components/utilisateur/FormulaireProfil.jsx
import React, { useState, useEffect } from 'react';
// import Layout from '../commun/Layout'; // <-- Ligne supprimée

import { getProfil, modifierProfil } from '../../services/serviceUtilisateur'; 

const FormulaireProfil = () => {
    const [profil, setProfil] = useState({
        id: null, 
        nom: '',
        prenom: '',
        email: '', 
        telephone: '',
        nouveauMotDePasse: '',
        confirmNouveauMotDePasse: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const chargerProfil = async () => {
            try {
                setLoading(true);
                const data = await getProfil(); 
                
                if (data && data.email) { 
                    setProfil(prev => ({
                        ...prev,
                        id: data.id || null, 
                        nom: data.nom || '', 
                        prenom: data.prenom || '',
                        email: data.email || '', 
                        telephone: data.telephone || '',
                        nouveauMotDePasse: '',
                        confirmNouveauMotDePasse: ''
                    }));
                    setError(null);
                } else {
                    setError("Impossible de charger le profil. Vous n'êtes peut-être pas connecté ou un problème est survenu.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement du profil:", err);
                setError(err.message || "Erreur lors du chargement du profil.");
            } finally {
                setLoading(false);
            }
        };

        chargerProfil();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfil(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const { nom, prenom, telephone, nouveauMotDePasse, confirmNouveauMotDePasse } = profil;

        if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
            setError("Tous les champs (Nom, Prénom, Téléphone) sont obligatoires.");
            return;
        }

        if (nouveauMotDePasse && nouveauMotDePasse.length < 6) {
            setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (nouveauMotDePasse !== confirmNouveauMotDePasse) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        const donneesAEnvoyer = {
            nom: nom.trim(),
            prenom: prenom.trim(),
            telephone: telephone.trim()
        };

        if (nouveauMotDePasse) {
            donneesAEnvoyer.motDePasse = nouveauMotDePasse; 
        }

        try {
            await modifierProfil(donneesAEnvoyer); 
            setSuccessMessage("Profil mis à jour avec succès !");
            setProfil(prev => ({ ...prev, nouveauMotDePasse: '', confirmNouveauMotDePasse: '' }));
        } catch (err) {
            console.error("Erreur lors de la mise à jour du profil:", err);
            setError(err.response?.data?.message || "Erreur inattendue lors de la mise à jour du profil.");
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-700">Chargement du profil...</div>; // <-- Layout supprimé
    }

    if (!profil.email && !loading) { 
        return (
            <div className="max-w-xl mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md mt-8">
                <p>Vous devez être connecté pour accéder à cette page de profil ou un problème est survenu lors du chargement.</p>
                <p>Veuillez vous connecter.</p>
            </div>
        ); // <-- Layout supprimé
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8"> {/* <-- Layout supprimé */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom :</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={profil.nom}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom :</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={profil.prenom}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profil.email}
                        readOnly 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone :</label>
                    <input
                        type="text"
                        id="telephone"
                        name="telephone"
                        value={profil.telephone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Changer le mot de passe (optionnel)</h3>
                    <div>
                        <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700">Nouveau mot de passe :</label>
                        <input
                            type="password"
                            id="nouveauMotDePasse"
                            name="nouveauMotDePasse"
                            value={profil.nouveauMotDePasse}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Laisser vide si inchangé"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNouveauMotDePasse" className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe :</label>
                        <input
                            type="password"
                            id="confirmNouveauMotDePasse"
                            name="confirmNouveauMotDePasse"
                            value={profil.confirmNouveauMotDePasse}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Confirmer le nouveau mot de passe"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Mettre à jour le profil
                </button>
            </form>
        </div>
    );
};

export default FormulaireProfil;
