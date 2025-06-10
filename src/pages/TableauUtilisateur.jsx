// src/pages/TableauUtilisateur.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';
import reservationService from '../services/reservationService'; // Importez le service de réservation

const TableauUtilisateur = () => {
    const [activeSection, setActiveSection] = useState('tableauDeBord'); // Défaut sur l'aperçu du tableau de bord
    const [userReservations, setUserReservations] = useState([]); // Nouvelle état pour les réservations de l'utilisateur
    const [loadingReservations, setLoadingReservations] = useState(false);
    const [errorReservations, setErrorReservations] = useState(null);

    const navigate = useNavigate();

    // Simule la récupération de l'ID utilisateur connecté (à remplacer par votre logique d'auth réelle)
    const getAuthenticatedUserId = () => {
        // Dans une application réelle, cet ID viendrait du contexte d'authentification,
        // d'un token JWT décodé, ou d'un appel à /api/auth/me après connexion.
        // Pour cet exemple, nous utilisons un ID fictif.
        // Si vous utilisez votre endpoint /api/auth/me, il faudrait le récupérer ainsi:
        // const profile = await getProfil(); // Appel à serviceUtilisateur.js
        // return profile.id;
        return 22; // ID utilisateur fictif pour le test
    };

    // Charger les réservations de l'utilisateur
    useEffect(() => {
        if (activeSection === 'mesReservations') {
            const fetchUserReservations = async () => {
                setLoadingReservations(true);
                setErrorReservations(null);
                try {
                    const userId = getAuthenticatedUserId(); // Récupérer l'ID de l'utilisateur connecté
                    const data = await reservationService.getReservationsForUser(userId);
                    setUserReservations(data);
                } catch (err) {
                    console.error("Erreur lors du chargement des réservations de l'utilisateur:", err);
                    setErrorReservations("Impossible de charger vos réservations.");
                } finally {
                    setLoadingReservations(false);
                }
            };
            fetchUserReservations();
        }
    }, [activeSection]); // Se déclenche quand la section active devient 'mesReservations'

    const handleLogout = () => {
        localStorage.removeItem('role');
        // Idéalement, faire aussi un appel de déconnexion au backend ici si nécessaire
        navigate('/connexion');
    };

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            try {
                const userId = getAuthenticatedUserId();
                await reservationService.cancelReservation(reservationId, userId);
                alert("Réservation annulée avec succès !");
                // Mettre à jour l'état des réservations localement ou recharger
                setUserReservations(prevReservations =>
                    prevReservations.map(res =>
                        res.id === reservationId ? { ...res, statut: 'ANNULEE' } : res
                    )
                );
            } catch (err) {
                console.error("Erreur lors de l'annulation de la réservation:", err);
                alert(`Erreur lors de l'annulation : ${err.response?.data || err.message}`);
            }
        }
    };


    const renderSection = () => {
        switch (activeSection) {
            case 'tableauDeBord':
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Aperçu de votre Espace</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-purple-100 p-3 rounded-md text-purple-800 text-sm">Dernière humeur: Heureux 😊</div>
                            <div className="bg-orange-100 p-3 rounded-md text-orange-800 text-sm">Prochain RDV: 25 Mai 🗓️</div>
                            {/* Ajoutez d'autres widgets personnalisés ici */}
                        </div>
                    </div>
                );
            case 'profil':
                return (
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Modifier votre profil
                        </h2>
                        <FormulaireProfil />
                    </section>
                );
            case 'suiviHumeur':
                return (
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Suivi de votre humeur
                        </h2>
                        <SuiviHumeur />
                    </section>
                );
            case 'mesReservations': // Nouvelle section pour les réservations de l'utilisateur
                return (
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Mes Réservations
                        </h2>
                        {loadingReservations ? (
                            <p>Chargement de vos réservations...</p>
                        ) : errorReservations ? (
                            <p className="text-red-500">{errorReservations}</p>
                        ) : userReservations.length === 0 ? (
                            <p className="text-gray-600">Vous n'avez aucune réservation pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professionnel</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {userReservations.map((res) => (
                                            <tr key={res.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(res.dateReservation).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {res.professionnel ? `${res.professionnel.prenom} ${res.professionnel.nom}` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.statut}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.prix ? `${res.prix} €` : 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {res.statut === 'EN_ATTENTE' && (
                                                        <button
                                                            onClick={() => handleCancelReservation(res.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Annuler
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                );
            default:
                return <div className="p-4 text-center text-gray-600">Sélectionnez une option dans le menu latéral.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-60 bg-indigo-700 text-white flex flex-col h-full shadow-lg">
                <div className="p-4 text-center text-xl font-bold border-b border-indigo-600">
                    <span className="text-indigo-200">Psy</span><span className="text-white">Connect</span> Utilisateur
                </div>
                <nav className="flex-grow mt-4">
                    <ul>
                        <li className="mb-1">
                            <button
                                className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 ${activeSection === 'tableauDeBord' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                onClick={() => setActiveSection('tableauDeBord')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 00-1 1v2a1 1 0 001 1h2m-6-6h-2a1 1 0 00-1 1v2a1 1 0 001 1h2"></path></svg>
                                Mon Tableau de bord
                            </button>
                        </li>
                        <li className="mb-1">
                            <button
                                className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 ${activeSection === 'profil' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                onClick={() => setActiveSection('profil')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Mon Profil
                            </button>
                        </li>
                        <li className="mb-1">
                            <button
                                className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 ${activeSection === 'suiviHumeur' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                onClick={() => setActiveSection('suiviHumeur')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Suivi d'Humeur
                            </button>
                        </li>
                        <li className="mb-1">
                            <button
                                className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 ${activeSection === 'mesReservations' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                onClick={() => setActiveSection('mesReservations')}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Mes Réservations
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="p-3 border-t border-indigo-600 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-md text-sm transition duration-200 flex items-center justify-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Se Déconnecter
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {activeSection === 'profil' ? 'Mon Profil' :
                            activeSection === 'suiviHumeur' ? "Mon Suivi d'Humeur" :
                                activeSection === 'tableauDeBord' ? 'Aperçu du Tableau de Bord Utilisateur' :
                                    activeSection === 'mesReservations' ? 'Mes Réservations' : // Titre dynamique
                                        'Espace Utilisateur'}
                    </h1>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default TableauUtilisateur;
