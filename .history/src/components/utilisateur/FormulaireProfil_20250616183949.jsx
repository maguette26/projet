import React, { useState, useEffect } from 'react';
import { getProfil, modifierProfil } from '../../services/serviceUtilisateur';

const initialProfil = {
    id: null,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nouveauMotDePasse: '',
    confirmNouveauMotDePasse: ''
};

const FormulaireProfil = () => {
    const [profil, setProfil] = useState(initialProfil);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const chargerProfil = async () => {
            setLoading(true);
            try {
                const data = await getProfil();
                console.log('Données profil récupérées :', data);
                if (data?.email) {
                    setProfil(prev => ({
                        ...prev,
                        id: data.id ?? null,
                        nom: data.nom ?? '',
                        prenom: data.prenom ?? '',
                        email: data.email,
                        telephone: data.telephone ?? ''
                    }));
                } else {
                    throw new Error("Profil invalide ou utilisateur non connecté.");
                }
            } catch (err) {
                console.error("Erreur de chargement du profil :", err);
                setError(err.message || "Erreur lors du chargement.");
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

    const validerChamps = () => {
        const { nom, prenom, telephone, nouveauMotDePasse, confirmNouveauMotDePasse } = profil;

        if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
            return "Tous les champs (Nom, Prénom, Téléphone) sont obligatoires.";
        }

        if (nouveauMotDePasse && nouveauMotDePasse.length < 6) {
            return "Le nouveau mot de passe doit contenir au moins 6 caractères.";
        }

        if (nouveauMotDePasse !== confirmNouveauMotDePasse) {
            return "Les nouveaux mots de passe ne correspondent pas.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const messageErreur = validerChamps();
        if (messageErreur) {
            setError(messageErreur);
            return;
        }

        const { nom, prenom, telephone, nouveauMotDePasse } = profil;
        const donneesAEnvoyer = {
            nom: nom.trim(),
            prenom: prenom.trim(),
            telephone: telephone.trim(),
            ...(nouveauMotDePasse && { motDePasse: nouveauMotDePasse })
        };

        try {
            await modifierProfil(donneesAEnvoyer);
            setSuccessMessage("Profil mis à jour avec succès !");
            setProfil(prev => ({
                ...prev,
                nouveauMotDePasse: '',
                confirmNouveauMotDePasse: ''
            }));
        } catch (err) {
            console.error("Erreur mise à jour :", err);
            setError(err.response?.data?.message || "Erreur inattendue.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
                Chargement du profil...
            </div>
        );
    }

    if (!profil.email && !loading) {
        return (
            <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md mt-10">
                <p>Vous devez être connecté pour accéder à cette page de profil.</p>
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
                {["nom", "prenom", "telephone"].map((champ) => (
                    <div key={champ}>
                        <label htmlFor={champ} className="block text-sm font-semibold text-gray-700 mb-1">
                            {champ.charAt(0).toUpperCase() + champ.slice(1)}
                        </label>
                        <input
                            type="text"
                            id={champ}
                            name={champ}
                            value={profil[champ]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                            placeholder={`Votre ${champ}`}
                        />
                    </div>
                ))}

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

                <fieldset className="border-t border-gray-300 pt-6">
                    <legend className="text-lg font-semibold text-gray-700 mb-4">Changer le mot de passe (optionnel)</legend>

                    {["nouveauMotDePasse", "confirmNouveauMotDePasse"].map((champ) => (
                        <div key={champ} className="mb-4">
                            <label htmlFor={champ} className="block text-sm font-semibold text-gray-700 mb-1">
                                {champ.includes("confirm") ? "Confirmer le mot de passe" : "Nouveau mot de passe"}
                            </label>
                            <input
                                type="password"
                                id={champ}
                                name={champ}
                                value={profil[champ]}
                                onChange={handleChange}
                                placeholder={champ.includes("confirm") ? "Confirmer le mot de passe" : "Laisser vide si inchangé"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
                            />
                        </div>
                    ))}
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
