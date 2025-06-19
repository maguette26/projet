// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/serviceAuth'; // Importer le service d'authentification

import Layout from '../components/commun/Layout';

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleConnexion = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Appel à la fonction de login, qui ne renvoie PAS de token, seulement le rôle
            const responseData = await login(email, motDePasse);
            const { role } = responseData; // Récupère le rôle directement

            // Nettoyer le rôle : "ROLE_ADMIN" -> "ADMIN", "ROLE_USER" -> "UTILISATEUR", etc.
            const cleanedRole = role.replace('ROLE_', '');

            // Stocker le rôle nettoyé dans le localStorage
            // Si le backend renvoie 'USER', et que vous voulez 'UTILISATEUR' sur le front
            let roleToStore = cleanedRole;
            if (cleanedRole === 'USER') {
                roleToStore = 'UTILISATEUR';
            }
            localStorage.setItem('role', roleToStore); // C'est tout ce que nous stockons localement

            setMessage('Connexion réussie ! Redirection en cours...');

            // Logique de redirection basée sur le rôle nettoyé
            switch (cleanedRole) {
                case 'ADMIN':
                    navigate('/tableau'); // Redirection spécifique pour l'ADMIN
                    break;
                case 'PSYCHIATRE':
                case 'PSYCHOLOGUE':
                case 'USER': // Utilisateur et Professionnel vont vers la page d'accueil
                    navigate('/');
                    break;
                default:
                    console.warn('Rôle utilisateur inconnu après connexion (nettoyé):', cleanedRole);
                    console.warn('Rôle utilisateur original du backend:', role);
                    navigate('/'); // Redirection par défaut si le rôle n'est pas reconnu
                    break;
            }

        } catch (error) {
            // Gérer les erreurs de connexion (ex: 401 Unauthorized)
            const errorMessage = error.response?.data?.message || "Connexion échouée. Veuillez vérifier votre email/mot de passe.";
            setMessage("Erreur : " + errorMessage);
            console.error("Erreur de connexion:", error.response || error.message);
        }
    };

    return (
        <Layout>
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
                <div className="max-w-md w-full space-y-8 shadow-lg p-8 rounded-2xl border border-gray-200 bg-white">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">Connexion à PsyConnect</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Connectez-vous pour accéder à votre espace personnel
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleConnexion}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={motDePasse}
                                    onChange={e => setMotDePasse(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                                Se connecter
                            </button>
                        </div>
                        {message && <p className={`text-sm text-center ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Connexion;