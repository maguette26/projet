// src/pages/TableauProfessionnel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormulaireDisponibilite from '../components/professionel/FormulaireDisponibilite';
import Messagerie from '../components/professionel/Messagerie';
// Importez les fonctions API nécessaires
import {
    ajouterDisponibilite,
    getDisponibilites,
    modifierDisponibilite,
    supprimerDisponibilite
} from '../services/servicePsy'; // Assurez-vous que le chemin est correct
import reservationService from '../services/reservationService'; // Importez le service de réservation

const TableauProfessionnel = () => {
    const [activeSection, setActiveSection] = useState('tableauDeBord');
    const [disponibilites, setDisponibilites] = useState([]); // État pour stocker les disponibilités
    const [disponibiliteAModifier, setDisponibiliteAModifier] = useState(null); // Pour l'édition
    const [proReservations, setProReservations] = useState([]); // Nouvel état pour les réservations du pro
    const [loadingProReservations, setLoadingProReservations] = useState(false);
    const [errorProReservations, setErrorProReservations] = useState(null);

    const navigate = useNavigate();

    // Simule la récupération de l'ID professionnel connecté (à remplacer par votre logique d'auth réelle)
    const getAuthenticatedProId = () => {
        // Dans une application réelle, cet ID viendrait du contexte d'authentification,
        // d'un token JWT décodé, ou d'un appel à /api/auth/me après connexion.
        // Pour cet exemple, nous utilisons un ID fictif.
        // Si vous utilisez votre endpoint /api/auth/me, il faudrait le récupérer ainsi:
        // const profile = await getProfil(); // Si vous avez un service pour le profil du pro
        // return profile.id;
        return 50; // ID professionnel fictif pour le test
    };

    // Fonction pour charger les disponibilités au montage du composant et quand nécessaire
    const fetchDisponibilites = async () => {
        try {
            const data = await getDisponibilites();
            setDisponibilites(data);
        } catch (error) {
            console.error("Erreur lors du chargement des disponibilités :", error);
            alert("Impossible de charger les disponibilités.");
        }
    };

    // Charger les réservations du professionnel
    const fetchProReservations = async () => {
        setLoadingProReservations(true);
        setErrorProReservations(null);
        try {
            const proId = getAuthenticatedProId(); // Récupérer l'ID du professionnel connecté
            const data = await reservationService.getReservationsForProfessional(proId);
            setProReservations(data);
        } catch (err) {
            console.error("Erreur lors du chargement des réservations du professionnel:", err);
            setErrorProReservations("Impossible de charger les réservations.");
        } finally {
            setLoadingProReservations(false);
        }
    };

    useEffect(() => {
        if (activeSection === 'disponibilites') {
            fetchDisponibilites();
        } else if (activeSection === 'gestionReservations') { // Charger les réservations quand cette section est active
            fetchProReservations();
        }
    }, [activeSection]);

    // Gère la soumission du formulaire d'ajout/modification de disponibilité
    const handleSaveDisponibilite = async (dispoData) => {
        try {
            if (disponibiliteAModifier) {
                await modifierDisponibilite(disponibiliteAModifier.id, dispoData);
                alert("Disponibilité modifiée avec succès !");
            } else {
                await ajouterDisponibilite(dispoData);
                alert("Disponibilité ajoutée avec succès !");
            }
            fetchDisponibilites();
            setDisponibiliteAModifier(null);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la disponibilité :", error);
            alert("Erreur lors de la sauvegarde de la disponibilité : " + (error.response?.data || error.message));
        }
    };

    // Gère la suppression d'une disponibilité
    const handleDeleteDisponibilite = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?")) {
            try {
                await supprimerDisponibilite(id);
                alert("Disponibilité supprimée avec succès !");
                fetchDisponibilites();
            } catch (error) {
                console.error("Erreur lors de la suppression de la disponibilité :", error);
                alert("Erreur lors de la suppression de la disponibilité : " + (error.response?.data || error.message));
            }
        }
    };

    // Gère la validation ou le refus d'une réservation
    const handleUpdateReservationStatus = async (reservationId, statut) => {
        if (window.confirm(`Êtes-vous sûr de vouloir ${statut === 'VALIDE' ? 'valider' : 'refuser'} cette réservation ?`)) {
            try {
                // Le backend vérifie l'autorisation via @AuthenticationPrincipal
                await reservationService.updateReservationStatus(reservationId, statut);
                alert(`Réservation ${statut === 'VALIDE' ? 'validée' : 'refusée'} avec succès !`);
                fetchProReservations(); // Recharger les réservations après modification
            } catch (err) {
                console.error(`Erreur lors de la mise à jour du statut de la réservation (${statut}):`, err);
                alert(`Erreur lors de la mise à jour du statut : ${err.response?.data || err.message}`);
            }
        }
    };

    // Gère la déconnexion du professionnel
    const handleLogout = () => {
        localStorage.removeItem('role');
        // Idéalement, faire aussi un appel de déconnexion au backend ici si nécessaire
        navigate('/connexion');
    };

    // Fonction pour rendre le composant de la section active
    const renderSection = () => {
        switch (activeSection) {
            case 'tableauDeBord':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aperçu de votre Tableau de Bord</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-purple-100 p-4 rounded-md text-purple-800">Prochains Rendez-vous: 3</div>
                            <div className="bg-teal-100 p-4 rounded-md text-teal-800">Messages Non Lus: 5</div>
                            <div className="bg-orange-100 p-4 rounded-md text-orange-800">Disponibilités définies: {disponibilites.length}</div>
                            {/* Ajoutez d'autres widgets pertinents ici */}
                        </div>
                    </div>
                );
            case 'disponibilites':
                return (
                    <section className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
                            Gérer mes disponibilités
                        </h2>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">
                            {disponibiliteAModifier ? "Modifier une disponibilité" : "Ajouter une nouvelle disponibilité"}
                        </h3>
                        <FormulaireDisponibilite
                            onSubmit={handleSaveDisponibilite}
                            disponibiliteInitiale={disponibiliteAModifier}
                            onCancel={() => setDisponibiliteAModifier(null)}
                        />

                        <h3 className="text-lg font-medium text-gray-700 mt-8 mb-3 pb-2 border-b border-gray-200">
                            Mes disponibilités existantes
                        </h3>
                        {disponibilites.length === 0 ? (
                            <p className="text-gray-600">Aucune disponibilité définie pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure Début</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure Fin</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {disponibilites.map((dispo) => (
                                            <tr key={dispo.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.heureDebut}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.heureFin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => setDisponibiliteAModifier(dispo)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDisponibilite(dispo.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                );
            case 'messagerie':
                return (
                    <section className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ma Messagerie</h2>
                        <Messagerie />
                    </section>
                );
            case 'gestionReservations': // Nouvelle section pour la gestion des réservations du professionnel
                return (
                    <section className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
                            Gestion des Réservations
                        </h2>
                        {loadingProReservations ? (
                            <p>Chargement des réservations...</p>
                        ) : errorProReservations ? (
                            <p className="text-red-500">{errorProReservations}</p>
                        ) : proReservations.length === 0 ? (
                            <p className="text-gray-600">Aucune réservation pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {proReservations.map((res) => (
                                            <tr key={res.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(res.dateReservation).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {res.utilisateur ? `${res.utilisateur.prenom} ${res.utilisateur.nom}` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.statut}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.prix ? `${res.prix} €` : 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {res.statut === 'EN_ATTENTE' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateReservationStatus(res.id, 'VALIDE')}
                                                                className="text-green-600 hover:text-green-900 mr-3"
                                                            >
                                                                Valider
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateReservationStatus(res.id, 'REFUSE')}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Refuser
                                                            </button>
                                                        </>
                                                    )}
                                                    {res.statut !== 'EN_ATTENTE' && (
                                                        <span className="text-gray-500 italic">Déjà traitée</span>
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
                return <div className="p-6 text-center text-gray-600">Sélectionnez une option dans le menu latéral.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar (Barre latérale de navigation) */}
            <aside className="w-64 bg-green-700 text-white flex flex-col h-full shadow-lg">
                <div className="p-6 text-center text-2xl font-bold border-b border-green-600">
                    <span className="text-green-200">Psy</span><span className="text-white">Connect</span> Pro
                </div>
                <nav className="flex-grow mt-6">
                    <ul>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'tableauDeBord' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('tableauDeBord')}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 00-1 1v2a1 1 0 001 1h2m-6-6h-2a1 1 0 00-1 1v2a1 1 0 001 1h2"></path></svg>
                                Tableau de bord
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'disponibilites' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('disponibilites')}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Mes disponibilités
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'messagerie' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('messagerie')}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Messagerie
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'gestionReservations' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('gestionReservations')}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7-7V3m0 0L9 6m3-3l3 3"></path></svg>
                                Réservations
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t border-green-600 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-green-600 hover:bg-green-800 text-white py-2 rounded-md transition duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Se Déconnecter
                    </button>
                </div>
            </aside>

            {/* Main Content Area (Zone de contenu principal) */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {activeSection === 'disponibilites' ? 'Gestion des Disponibilités' :
                            activeSection === 'tableauDeBord' ? 'Tableau de Bord Professionnel' :
                                activeSection === 'messagerie' ? 'Messagerie' :
                                    activeSection === 'gestionReservations' ? 'Gestion des Réservations' : // Titre dynamique
                                        'Espace Professionnel'}
                    </h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default TableauProfessionnel;
