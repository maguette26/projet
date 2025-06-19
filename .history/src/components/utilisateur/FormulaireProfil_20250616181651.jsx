import React, { useState, useEffect } from 'react';
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
        return <div className="flex justify-center items-center h-40 text-gray-600 font-medium text-lg">Chargement du profil...</div>;
    }

    if (!profil.email && !loading) { 
        return (
            <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md mt-10">
                <p>Vous devez être connecté pour accéder à cette page de profil ou un problème est survenu lors du chargement.</p>
                <p className="mt-2">Veuillez vous connecter.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">Mon Profil</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-md mb-6 shadow-sm">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-3 rounded-md mb-6 shadow-sm">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={profil.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                        placeholder="Votre nom"
                    />
                </div>

                <div>
                    <label htmlFor="prenom" className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={profil.prenom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                        placeholder="Votre prénom"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profil.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                    <input
                        type="text"
                        id="telephone"
                        name="telephone"
                        value={profil.telephone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                        placeholder="Votre numéro de téléphone"
                    />
                </div>

                <fieldset className="border-t border-gray-300 pt-6">
                    <legend className="text-lg font-semibold text-gray-700 mb-4">Changer le mot de passe (optionnel)</legend>

                    <div className="mb-4">
                        <label htmlFor="nouveauMotDePasse" className="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="nouveauMotDePasse"
                            name="nouveauMotDePasse"
                            value={profil.nouveauMotDePasse}
                            onChange={handleChange}
                            placeholder="Laisser vide si inchangé"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmNouveauMotDePasse" className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            id="confirmNouveauMotDePasse"
                            name="confirmNouveauMotDePasse"
                            value={profil.confirmNouveauMotDePasse}
                            onChange={handleChange}
                            placeholder="Confirmer le nouveau mot de passe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                        />
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition"
                >
                    Mettre à jour le profil
                </button>
            </form>
        </div>
    );
};

export default FormulaireProfil;
