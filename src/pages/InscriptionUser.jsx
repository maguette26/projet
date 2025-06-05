import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Assurez-vous que le chemin est correct

const InscriptionUser = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmerMotDePasse: '',
        telephone: ''
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
        if (!/[^A-Za-z0-9]/.test(password)) { // Caractères spéciaux
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Réinitialise toutes les erreurs au début de la soumission
        setSuccess(null);

        if (!validateForm()) {
            // Si la validation frontend échoue, ne pas envoyer la requête
            return;
        }

        try {
            const dataToSubmit = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                confirmMotDePasse: formData.confirmerMotDePasse, // Correspond à 'confirmMotDePasse' dans votre DTO backend
                telephone: formData.telephone
            };

            const response = await api.post('/auth/register', dataToSubmit);
            setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            setTimeout(() => {
                navigate('/');
            }, 2000);
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
                        Inscription Utilisateur
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Créez votre compte pour accéder aux ressources et au forum.
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
                            {errors.motDePasse && <p className="text-red-500 text-xs mt-1">{errors.motDePasse}</p>}
                        </div>
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
                    </div>

                    {errors.general && <p className="mt-2 text-center text-sm text-red-600">{errors.general}</p>}
                    {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            S'inscrire
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

export default InscriptionUser;