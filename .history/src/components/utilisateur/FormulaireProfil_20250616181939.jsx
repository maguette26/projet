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

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Nom */}
                <div className="relative">
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={profil.nom}
                        onChange={handleChange}
                        required
                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                        placeholder="Nom"
                    />
                    <label
                        htmlFor="nom"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
                    >
                        Nom
                    </label>
                </div>

                {/* Prénom */}
                <div className="relative">
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={profil.prenom}
                        onChange={handleChange}
                        required
                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                        placeholder="Prénom"
                    />
                    <label
                        htmlFor="prenom"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
                    >
                        Prénom
                    </label>
                </div>

                {/* Email (readonly) */}
                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profil.email}
                        readOnly
                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        placeholder="Email"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all"
                    >
                        Email
                    </label>
                </div>

                {/* Téléphone */}
                <div className="relative">
                    <input
                        type="text"
                        id="telephone"
                        name="telephone"
                        value={profil.telephone}
                        onChange={handleChange}
                        required
                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                        placeholder="Téléphone"
                    />
                    <label
                        htmlFor="telephone"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
                    >
                        Téléphone
                    </label>
                </div>

                {/* Mot de passe */}
                <fieldset className="border-t border-gray-300 pt-6 space-y-6">
                    <legend className="text-lg font-semibold text-gray-700 mb-4">Changer le mot de passe (optionnel)</legend>

                    <div className="relative">
                        <input
                            type="password"
                            id="nouveauMotDePasse"
                            name="nouveauMotDePasse"
                            value={profil.nouveauMotDePasse}
                            onChange={handleChange}
                            placeholder="Nouveau mot de passe"
                            className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                        />
                        <label
                            htmlFor="nouveauMotDePasse"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
                        >
                            Nouveau mot de passe
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="confirmNouveauMotDePasse"
                            name="confirmNouveauMotDePasse"
                            value={profil.confirmNouveauMotDePasse}
                            onChange={handleChange}
                            placeholder="Confirmer le nouveau mot de passe"
                            className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600"
                        />
                        <label
                            htmlFor="confirmNouveauMotDePasse"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-indigo-600 peer-focus:text-sm"
                        >
                            Confirmer le nouveau mot de passe
                        </label>
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
