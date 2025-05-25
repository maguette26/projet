// src/pages/Inscription.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Layout from '../components/commun/Layout'; // Importe le composant Layout

const Inscription = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
    const [message, setMessage] = useState('');
    // État pour gérer le choix du type d'utilisateur
    const [typeUtilisateur, setTypeUtilisateur] = useState('USER'); // 'USER' par défaut

    const navigate = useNavigate();

    const handleInscription = async (e) => {
        e.preventDefault();
        setMessage(''); // Réinitialise les messages précédents

        if (motDePasse !== confirmMotDePasse) {
            setMessage("Erreur : Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Envoyez le rôle choisi au backend. Assurez-vous que votre backend accepte et gère ce champ.
            const response = await axios.post('http://192.168.1.157:9191/api/auth/register', {
                nom, 
                email,
                motDePasse,
                role: typeUtilisateur, // Par exemple, 'USER', 'PSYCHOLOGUE', 'PSYCHIATRE'
            });

            setMessage('Inscription réussie ! Veuillez maintenant vous connecter.');
            // Après l'inscription, on redirige vers la page de connexion.
            // L'utilisateur pourra ensuite se connecter et être redirigé selon son rôle.
            navigate('/connexion'); 

            // --- OPTIONNEL : Connexion automatique après inscription (si votre backend le permet et si vous le souhaitez) ---
            /*
            // Si votre backend renvoie le token et le rôle DIRECTEMENT après l'inscription
            // et que vous voulez connecter l'utilisateur automatiquement :
            const { token, role: registeredRole } = response.data; // Renomme 'role' pour éviter un conflit de nom
            localStorage.setItem('token', token);
            let roleToStore = registeredRole;
            if (registeredRole === 'USER') {
                roleToStore = 'UTILISATEUR';
            }
            localStorage.setItem('role', roleToStore);

            setMessage('Inscription réussie ! Redirection vers votre espace...');
            switch (registeredRole) {
                case 'ADMIN': 
                    navigate('/tableauAdmin'); 
                    break;
                case 'PSYCHIATRE':
                case 'PSYCHOLOGUE':
                    navigate('/tableauProfessionnel');
                    break;
                case 'USER': 
                    navigate('/tableauUtilisateur');
                    break;
                default:
                    console.warn('Rôle utilisateur inconnu après inscription:', registeredRole);
                    navigate('/');
                    break;
            }
            */
            // --- FIN OPTIONNEL ---

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.";
            setMessage("Erreur : " + errorMessage);
            console.error("Erreur d'inscription:", error.response || error.message);
        }
    };

    return (
        <Layout> {/* Utilisation du composant Layout qui contient Header et PiedPage */}
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
                <div className="max-w-md w-full space-y-8 shadow-lg p-8 rounded-2xl border border-gray-200 bg-white">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">Créez votre compte PsyConnect</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Rejoignez notre communauté dès aujourd'hui
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleInscription}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    id="nom"
                                    name="nom"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={nom}
                                    onChange={e => setNom(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
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
                                    autoComplete="new-password"
                                    required
                                    value={motDePasse}
                                    onChange={e => setMotDePasse(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmMotDePasse}
                                    onChange={e => setConfirmMotDePasse(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            {/* Choix du type d'utilisateur lors de l'inscription */}
                            <div>
                                <label htmlFor="type-utilisateur" className="block text-sm font-medium text-gray-700">Vous êtes un(e) :</label>
                                <select 
                                    id="type-utilisateur" 
                                    name="type-utilisateur" 
                                    value={typeUtilisateur} 
                                    onChange={e => setTypeUtilisateur(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="USER">Utilisateur simple</option>
                                    <option value="PSYCHOLOGUE">Psychologue</option>
                                    <option value="PSYCHIATRE">Psychiatre</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                                S'inscrire
                            </button>
                        </div>
                        {message && <p className={`text-sm text-center ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Inscription;