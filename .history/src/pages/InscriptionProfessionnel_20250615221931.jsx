import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Assurez-vous que le chemin est correct

const InscriptionProfessionnel = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmerMotDePasse: '',
        telephone: '',
        specialite: '',
        documentJustificatif: null
    });
    const [errors, setErrors] = useState({}); // Utilisez un objet pour stocker les erreurs par champ
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Fonction de validation pour le mot de passe
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Le mot de passe doit contenir au moins 8 caractères.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins un chiffre.");
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
        }
        return errors;
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Nom
        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est obligatoire.";
            isValid = false;
        }

        // Prénom
        if (!formData.prenom.trim()) {
            newErrors.prenom = "Le prénom est obligatoire.";
            isValid = false;
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "L'adresse email est obligatoire.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "L'adresse email n'est pas valide.";
            isValid = false;
        }

        // Téléphone
        if (!formData.telephone.trim()) {
            newErrors.telephone = "Le numéro de téléphone est obligatoire.";
            isValid = false;
        } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.telephone)) { // Regex simple pour un numéro de téléphone international
            newErrors.telephone = "Le format du numéro de téléphone n'est pas valide.";
            isValid = false;
        }

        // Spécialité
        if (!formData.specialite) {
            newErrors.specialite = "Veuillez sélectionner une spécialité.";
            isValid = false;
        }

        // Mot de passe
        const passwordErrors = validatePassword(formData.motDePasse);
        if (passwordErrors.length > 0) {
            newErrors.motDePasse = passwordErrors.join(" "); // Concaténer les erreurs
            isValid = false;
        }

        // Confirmation du mot de passe
        if (formData.motDePasse !== formData.confirmerMotDePasse) {
            newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas.";
            isValid = false;
        }

        // Document Justificatif
        if (!formData.documentJustificatif) {
            newErrors.documentJustificatif = "Veuillez télécharger un document justificatif.";
            isValid = false;
        } else {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(formData.documentJustificatif.type)) {
                newErrors.documentJustificatif = "Le document doit être au format PDF, JPG ou PNG.";
                isValid = false;
            }
            if (formData.documentJustificatif.size > 5 * 1024 * 1024) { // 5 MB max
                newErrors.documentJustificatif = "La taille du document ne doit pas dépasser 5 Mo.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Effacer l'erreur spécifique au champ quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, documentJustificatif: e.target.files[0] }));
        // Effacer l'erreur de document quand un fichier est sélectionné
        if (errors.documentJustificatif) {
            setErrors(prev => ({ ...prev, documentJustificatif: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, general: null })); // Réinitialise l'erreur générale
        setSuccess(null);

        if (!validateForm()) {
            // scrollTo top or show general error if specific errors are present
            return;
        }

        const data = new FormData();
        data.append('nom', formData.nom);
        data.append('prenom', formData.prenom);
        data.append('email', formData.email);
        data.append('motDePasse', formData.motDePasse);
        data.append('telephone', formData.telephone);
        data.append('specialite', formData.specialite);
        data.append('document', formData.documentJustificatif);

        try {
            const response = await api.post('/professionnels/inscription', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Inscription réussie ! Votre compte est en attente de validation par l\'administrateur.');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Erreur d\'inscription:', err.response?.data || err.message);
            // Afficher les erreurs du backend si elles sont présentes, sinon une erreur générique
            const backendErrors = err.response?.data?.errors; // Supposant que le backend renvoie un tableau d'erreurs
            if (backendErrors && Array.isArray(backendErrors)) {
                const errorMessages = backendErrors.map(err => err.defaultMessage || err.message).join(' ');
                setErrors(prev => ({ ...prev, general: errorMessages })); // Afficher les erreurs backend comme erreur générale
            } else if (err.response?.data?.message) {
                 setErrors(prev => ({ ...prev, general: err.response.data.message }));
            }
            else {
                setErrors(prev => ({ ...prev, general: 'Erreur lors de l\'inscription. Veuillez réessayer.' }));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Inscription Professionnel de Santé Mentale
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Veuillez remplir le formulaire et fournir votre document justificatif.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                autoComplete="family-name"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Nom"
                                value={formData.nom}
                                onChange={handleChange}
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                        </div>
                        <div>
                            <input
                                id="prenom"
                                name="prenom"
                                type="text"
                                autoComplete="given-name"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.prenom ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Prénom"
                                value={formData.prenom}
                                onChange={handleChange}
                            />
                            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                        </div>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Adresse email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        {/* CHAMP MOT DE PASSE */}
                        <div>
                            <input
                                id="motDePasse"
                                name="motDePasse"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.motDePasse ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Mot de passe"
                                value={formData.motDePasse}
                                onChange={handleChange}
                            />
                            {/* REMARQUE POUR LE MOT DE PASSE AJOUTÉE ICI */}
                            
                            {errors.motDePasse && <p className="text-red-500 text-xs mt-1">{errors.motDePasse}</p>}
                        </div>
                        {/* FIN CHAMP MOT DE PASSE */}
                        <div>
                            <input
                                id="confirmerMotDePasse"
                                name="confirmerMotDePasse"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.confirmerMotDePasse ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Confirmer le mot de passe"
                                value={formData.confirmerMotDePasse}
                                onChange={handleChange}
                            />
                            {errors.confirmerMotDePasse && <p className="text-red-500 text-xs mt-1">{errors.confirmerMotDePasse}</p>}
                        </div>
                        <div>
                            <input
                                id="telephone"
                                name="telephone"
                                type="tel"
                                autoComplete="tel"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                placeholder="Téléphone (ex: +212 600 000000)"
                                value={formData.telephone}
                                onChange={handleChange}
                            />
                            {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                        </div>
                        <div>
                            <select
                                id="specialite"
                                name="specialite"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.specialite ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                value={formData.specialite}
                                onChange={handleChange}
                            >
                                <option value="">Sélectionnez votre spécialité</option>
                                <option value="psychiatrie">Psychiatre</option>
                                <option value="psychologie">Psychologue</option>
                                {/* Ajoutez d'autres spécialités si nécessaire */}
                            </select>
                            {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>}
                        </div>
                        <div className="py-2">
                            <label htmlFor="documentJustificatif" className="block text-sm font-medium text-gray-700 mb-1">
                                Document Justificatif (PDF, JPG, PNG, max 5Mo)
                            </label>
                            <input
                                id="documentJustificatif"
                                name="documentJustificatif"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.documentJustificatif ? 'border border-red-500 rounded-md' : ''}`}
                                onChange={handleFileChange}
                            />
                            <p className="mt-1 text-xs text-gray-500">Veuillez joindre un document attestant de votre statut professionnel (ex: diplôme, attestation).</p>
                            {errors.documentJustificatif && <p className="text-red-500 text-xs mt-1">{errors.documentJustificatif}</p>}
                        </div>
                    </div>

                    {errors.general && <p className="mt-2 text-center text-sm text-red-600">{errors.general}</p>}
                    {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            S'inscrire en tant que Professionnel
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
                        Connectez-vous ici
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InscriptionProfessionnel;