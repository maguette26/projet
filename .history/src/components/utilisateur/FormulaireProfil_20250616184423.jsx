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

const InputField = ({ label, type, name, value, onChange, readOnly = false, required = false, placeholder }) => (
    <div className="relative z-0 w-full group">
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required={required}
            placeholder=" "
            className={`block py-3 px-2 w-full text-md bg-transparent border-0 border-b-2 
                ${readOnly ? 'bg-gray-100 text-gray-400 border-gray-300' : 'text-gray-900 border-gray-300 focus:border-indigo-600'} 
                appearance-none focus:outline-none focus:ring-0 peer`}
        />
        <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-5"
        >
            {label}
        </label>
    </div>
);

const FormulaireProfil = () => {
    const [profil, setProfil] = useState(initialProfil);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const chargerProfil = async () => {
            try {
                const data = await getProfil();
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
                    throw new Error("Utilisateur non connecté.");
                }
            } catch (err) {
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
        if (!nom.trim() || !prenom.trim() || !telephone.trim()) return "Tous les champs sont obligatoires.";
        if (nouveauMotDePasse && nouveauMotDePasse.length < 6) return "Mot de passe trop court.";
        if (nouveauMotDePasse !== confirmNouveauMotDePasse) return "Les mots de passe ne correspondent pas.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const erreur = validerChamps();
        if (erreur) return setError(erreur);

        const { nom, prenom, telephone, nouveauMotDePasse } = profil;
        const donneesAEnvoyer = {
            nom: nom.trim(),
            prenom: prenom.trim(),
            telephone: telephone.trim(),
            ...(nouveauMotDePasse && { motDePasse: nouveauMotDePasse })
        };

        try {
            await modifierProfil(donneesAEnvoyer);
            setSuccessMessage("✅ Profil mis à jour avec succès !");
            setProfil(prev => ({
                ...prev,
                nouveauMotDePasse: '',
                confirmNouveauMotDePasse: ''
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Erreur inattendue.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-40 text-gray-500 text-lg">Chargement...</div>;
    }

    if (!profil.email && !loading) {
        return (
            <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md mt-10">
                <p>Vous devez être connecté pour accéder à cette page de profil.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl mt-12 border border-gray-100">
            <h2 className="text-4xl font-bold text-indigo-700 mb-8 text-center">🧍 Mon Profil</h2>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <InputField label="Nom" type="text" name="nom" value={profil.nom} onChange={handleChange} required />
                <InputField label="Prénom" type="text" name="prenom" value={profil.prenom} onChange={handleChange} required />
                <InputField label="Email" type="email" name="email" value={profil.email} onChange={handleChange} readOnly />
                <InputField label="Téléphone" type="text" name="telephone" value={profil.telephone} onChange={handleChange} required />

                <fieldset className="pt-6 border-t border-gray-200">
                    <legend className="text-lg font-semibold text-gray-700 mb-4">🔒 Nouveau mot de passe (facultatif)</legend>
                    <InputField label="Nouveau mot de passe" type="password" name="nouveauMotDePasse" value={profil.nouveauMotDePasse} onChange={handleChange} />
                    <InputField label="Confirmer le mot de passe" type="password" name="confirmNouveauMotDePasse" value={profil.confirmNouveauMotDePasse} onChange={handleChange} />
                </fieldset>

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition duration-200"
                >
                    💾 Enregistrer les modifications
                </button>
            </form>
        </div>
    );
};

export default FormulaireProfil;
