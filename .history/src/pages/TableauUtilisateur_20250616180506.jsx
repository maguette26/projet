// src/pages/Utilisateur/TableauUtilisateur.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout'; 
import SuiviHumeur from '../components/utilisateur/SuiviHumeur'; 
import FormulaireProfil from '../components/utilisateur/FormulaireProfil'; 
// Importe le nouveau composant MesReservations
import MesReservations from '../components/utilisateur/MesReservations';
import { 
    getProfil, 
    getConsultationsUtilisateur, 
    // cancelReservation, // Plus directement utilisé ici, mais via MesReservations
    // getReservationsUtilisateur // Plus directement utilisé ici, mais via MesReservations
} from '../services/serviceUtilisateur'; 

const TableauUtilisateur = () => {
    const [currentUser, setCurrentUser] = useState(null);
    // const [reservations, setReservations] = useState([]); // Déplacé dans MesReservations
    const [consultationsPassees, setConsultationsPassees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null); 
    // const [reservationsError, setReservationsError] = useState(null); // Géré par MesReservations via onError
    const [consultationsError, setConsultationsError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('reservations'); 

    // États pour le modal de confirmation personnalisé (existant)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState(''); // Ajouté pour un titre
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmModalAction, setConfirmModalAction] = useState(null); 

    // Nouveaux états pour le modal d'information personnalisé
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState('');
    const [infoModalContent, setInfoModalContent] = useState('');

    // Effet pour masquer les messages de succès/erreur après un délai
    useEffect(() => {
        if (successMessage || globalError) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setGlobalError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, globalError]);

    // Fonction pour afficher le modal de confirmation (sera passée à MesReservations)
    const handleShowConfirmModal = useCallback((message, action) => {
        setConfirmModalTitle("Confirmation");
        setConfirmModalMessage(message);
        setConfirmModalAction(() => () => { // Assurez-vous que l'action est bien une fonction à appeler
            action(); // Exécute l'action passée
            setShowConfirmModal(false); // Ferme la modale après l'action
        });
        setShowConfirmModal(true);
    }, []);

    // Fonction pour afficher le modal d'information (sera passée à MesReservations)
    const handleShowInfoModal = useCallback((title, content) => {
        setInfoModalTitle(title);
        setInfoModalContent(content);
        setShowInfoModal(true);
    }, []);


    // Fetch current user info (including ID, email, role, nom, prenom, telephone)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getProfil(); 
                
                if (user && user.id && user.role === 'USER') {
                    setCurrentUser(user);
                    setGlobalError(null); 
                } else {
                    setCurrentUser(null);
                    setGlobalError("Accès refusé : Vous n'êtes pas un utilisateur ou non connecté.");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des données utilisateur:", err);
                setCurrentUser(null);
                setGlobalError("Erreur de connexion. Veuillez vous reconnecter.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []); 

    // Fetch User Consultations (dépend de currentUser.id)
    const fetchConsultations = useCallback(async () => {
        if (!currentUser || !currentUser.id) {
            setConsultationsPassees([]); 
            setConsultationsError(null); 
            return;
        }
        setConsultationsError(null); 
        try {
            const data = await getConsultationsUtilisateur();
            setConsultationsPassees(data);
        } catch (err) {
            console.error("Erreur de chargement des consultations passées:", err);
            setConsultationsError("Impossible de charger vos consultations passées."); 
        }
    }, [currentUser]);

    // Déclenche le chargement des données quand currentUser change
    useEffect(() => {
        if (currentUser && currentUser.id) { 
            fetchConsultations();
        }
    }, [currentUser, fetchConsultations]);

    // handleCancelReservation n'est plus nécessaire ici car géré par MesReservations

    const formatDateTime = (dateString, timeString = '') => {
        if (!dateString) return 'N/A';
        try {
            let dateTime;
            if (timeString) {
                dateTime = new Date(`${dateString}T${timeString}`);
            } else {
                dateTime = new Date(dateString);
            }
            
            if (isNaN(dateTime.getTime())) {
                console.warn("Invalid date format detected for:", dateString, timeString);
                return `${dateString}${timeString ? ' ' + timeString : ''}`; 
            }

            return dateTime.toLocaleString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: timeString ? '2-digit' : undefined, 
                minute: timeString ? '2-digit' : undefined
            });
        } catch (e) {
            console.error("Erreur de formatage de date/heure:", e);
            return `${dateString}${timeString ? ' ' + timeString : ''}`; 
        }
    };

    // Gestion du chargement initial
    if (loading) {
        return <Layout><div className="text-center py-8">Chargement du tableau de bord...</div></Layout>;
    }

    // Gestion des erreurs d'accès ou de non-authentification (affichées en haut)
    if (globalError && !currentUser) {
        return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto mt-8 max-w-2xl">{globalError}</div></Layout>;
    }

    // Si l'utilisateur n'est pas un USER ou si currentUser est null après chargement
    if (!currentUser || currentUser.role !== 'USER') {
        return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto mt-8 max-w-2xl">Vous n'avez pas les autorisations nécessaires pour accéder à ce tableau de bord.</div></Layout>;
    }

    // Rendu dynamique de la section active
    const renderSection = () => {
        switch (activeTab) {
            case 'reservations':
                return (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4"> </h2>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            {/* Rendu du composant MesReservations ici */}
                            <MesReservations 
                                onError={setGlobalError} // MesReservations passe les erreurs à globalError
                                onShowConfirm={handleShowConfirmModal} // Passer la fonction de confirmation
                                onShowInfo={handleShowInfoModal} // Passer la fonction d'info
                            />
                        </div>
                    </section>
                );
            case 'consultations':
                return (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4"> </h2>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            {consultationsError ? ( 
                                <p className="text-red-500">{consultationsError}</p>
                            ) : consultationsPassees.length === 0 ? (
                                <p className="text-gray-600">Vous n'avez pas d'historique de consultations pour le moment.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professionnel</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée (min)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {consultationsPassees.map((con) => (
                                                <tr key={con.idConsultation}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDateTime(con.dateConsultation, con.heure)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {con.professionnel ? `Dr. ${con.professionnel.prenom} ${con.professionnel.nom}` : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{con.prix} MAD</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{con.dureeMinutes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                );
            case 'humeur':
                return (
                    <section>
                        <SuiviHumeur currentUser={currentUser} />
                    </section>
                );
            case 'profil':
                return (
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            
                        </h2>
                        <FormulaireProfil />
                    </section>
                );
            default:
                return (
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Aperçu de votre Espace</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-purple-100 p-3 rounded-md text-purple-800 text-sm">Aperçu rapide...</div>
                            <div className="bg-orange-100 p-3 rounded-md text-orange-800 text-sm">Informations importantes...</div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row h-full md:h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-full md:w-60 bg-indigo-700 text-white flex-shrink-0 flex flex-col shadow-lg p-4">
                    <div className="p-4 text-center text-xl font-bold border-b border-indigo-600 mb-4">
                        <span className="text-indigo-200">Psy</span><span className="text-white">Connect</span> Utilisateur
                    </div>
                    <nav className="flex-grow">
                        <ul>
                            <li className="mb-1">
                                <button
                                    className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 rounded-md ${activeTab === 'reservations' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                    onClick={() => setActiveTab('reservations')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Mes Réservations
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 rounded-md ${activeTab === 'consultations' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                    onClick={() => setActiveTab('consultations')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                    Historique Consultations
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 rounded-md ${activeTab === 'humeur' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                    onClick={() => setActiveTab('humeur')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Suivi d'Humeur
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className={`w-full text-left px-4 py-2 flex items-center text-sm transition-colors duration-200 rounded-md ${activeTab === 'profil' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-800'}`}
                                    onClick={() => setActiveTab('profil')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Mon Profil
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="p-3 border-t border-indigo-600 mt-auto">
                        {/* Empty div for spacing/future use, logout is handled by Layout's Header */}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'profil' ? 'Mon Profil' :
                                activeTab === 'humeur' ? "Mon Suivi d'Humeur" :
                                    activeTab === 'reservations' ? 'Mes Réservations' :
                                        activeTab === 'consultations' ? 'Historique des Consultations' :
                                            'Espace Utilisateur'}
                        </h1>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                        {/* Global error messages (for authentication/access issues) */}
                        {globalError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {globalError}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                {successMessage}
                            </div>
                        )}
                        {renderSection()}
                    </main>
                </div>

                {/* Modal de confirmation personnalisé */}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{confirmModalTitle}</h3>
                            <p className="text-gray-700 mb-6">{confirmModalMessage}</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmModalAction) {
                                            confirmModalAction(); 
                                        }
                                    }}
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal d'information personnalisé (NOUVEAU) */}
                {showInfoModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{infoModalTitle}</h3>
                            <div className="whitespace-pre-wrap text-gray-700 mb-6">{infoModalContent}</div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TableauUtilisateur;
