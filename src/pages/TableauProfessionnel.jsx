// src/pages/TableauProfessionnel.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/commun/Layout';
import { getCurrentUserInfo } from '../services/serviceAuth';
import { useNavigate } from 'react-router-dom';
import { 
    getDisponibilites, 
    ajouterDisponibilite, 
    modifierDisponibilite, 
    supprimerDisponibilite 
} from '../services/servicePsy'; // Importer les fonctions du service PROFESSIONNEL

const TableauProfessionnel = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [disponibilites, setDisponibilites] = useState([]);
    const [showDispoModal, setShowDispoModal] = useState(false); 
    const [currentDispo, setCurrentDispo] = useState(null); 
    const [activeTab, setActiveTab] = useState('informations'); // Nouvel état pour les onglets: 'informations', 'disponibilites', 'reservations', 'consultations', 'profil'
    const navigate = useNavigate();

    // États pour le formulaire de disponibilité
    const [dispoDate, setDispoDate] = useState('');
    const [dispoHeureDebut, setDispoHeureDebut] = useState('');
    const [dispoHeureFin, setDispoHeureFin] = useState('');

    // Message de succès/erreur général pour les opérations CRUD sur disponibilités
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Charger l'utilisateur connecté et ses disponibilités au démarrage
    useEffect(() => {
        const fetchProfessionalData = async () => {
            try {
                const user = getCurrentUserInfo();
                if (!user || !(user.role === 'PSYCHOLOGUE' || user.role === 'PSYCHIATRE')) {
                    setGlobalError("Accès refusé : Vous n'êtes pas un professionnel de santé mentale ou non connecté.");
                    navigate('/connexion'); // Rediriger si non autorisé
                } else {
                    setCurrentUser(user);
                    await fetchDisponibilites(); // Charger les disponibilités du professionnel
                    setGlobalError(null);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données du professionnel:", err);
                setGlobalError("Impossible de charger le tableau de bord. " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchProfessionalData();
    }, [navigate]); // navigate est une dépendance stable

    // Fonction pour récupérer les disponibilités (peut être appelée après ajout/modif/suppression)
    const fetchDisponibilites = async () => {
        try {
            // Pas de setLoading(true) ici car déjà géré par fetchProfessionalData au global
            const data = await getDisponibilites(); 
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.heureDebut}`);
                const dateB = new Date(`${b.date}T${b.heureDebut}`);
                return dateA - dateB;
            });
            setDisponibilites(sortedData);
        } catch (err) {
            console.error("Erreur lors du chargement des disponibilités:", err);
            // Afficher l'erreur spécifique pour cette section si nécessaire, ou globalement
            setGlobalError("Impossible de charger les disponibilités. " + (err.response?.data || err.message));
        }
    };

    const handleAddOrUpdateDispo = async (e) => {
        e.preventDefault();
        setGlobalError(null); // Réinitialiser les erreurs générales

        if (!dispoDate || !dispoHeureDebut || !dispoHeureFin) {
            setGlobalError("Veuillez remplir tous les champs de la disponibilité.");
            return;
        }

        const newDispoData = {
            date: dispoDate,
            heureDebut: dispoHeureDebut,
            heureFin: dispoHeureFin,
        };

        try {
            if (currentDispo) {
                await modifierDisponibilite(currentDispo.id, newDispoData);
                setMessage("Disponibilité modifiée avec succès !");
            } else {
                await ajouterDisponibilite(newDispoData);
                setMessage("Disponibilité ajoutée avec succès !");
            }
            fetchDisponibilites(); 
            setShowDispoModal(false); 
            resetDispoForm(); 
        } catch (err) {
            console.error("Erreur lors de l'opération sur la disponibilité:", err);
            setGlobalError("Opération échouée: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteDispo = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?")) {
            try {
                await supprimerDisponibilite(id);
                setMessage("Disponibilité supprimée avec succès !");
                fetchDisponibilites(); 
            } catch (err) {
                console.error("Erreur lors de la suppression de la disponibilité:", err);
                setGlobalError("Suppression échouée: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const openAddDispoModal = () => {
        setCurrentDispo(null); 
        resetDispoForm();
        setShowDispoModal(true);
    };

    const openEditDispoModal = (dispo) => {
        setCurrentDispo(dispo);
        setDispoDate(dispo.date);
        setDispoHeureDebut(dispo.heureDebut);
        setDispoHeureFin(dispo.heureFin);
        setShowDispoModal(true);
    };

    const resetDispoForm = () => {
        setDispoDate('');
        setDispoHeureDebut('');
        setDispoHeureFin('');
        setGlobalError(null); 
    };

    if (loading) {
        return <Layout><div className="text-center py-8 text-gray-600">Chargement du tableau de bord professionnel...</div></Layout>;
    }

    if (globalError && !currentUser) { // Affiche l'erreur principale si non connecté ou rôle incorrect
        return (
            <Layout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-8 max-w-xl">
                    {globalError}
                </div>
            </Layout>
        );
    }
    
    // Convertir les rôles PSYCHOLOGUE/PSYCHIATRE en français pour l'affichage
    const roleFr = currentUser?.role === 'PSYCHOLOGUE' ? 'Psychologue' : 
                   currentUser?.role === 'PSYCHIATRE' ? 'Psychiatre' : currentUser?.role;

    // Fonction de rendu des sections basée sur l'onglet actif
    const renderSection = () => {
        switch (activeTab) {
            case 'informations':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mes Informations Personnelles</h2>
                        <p><strong>Nom:</strong> {currentUser?.nom} {currentUser?.prenom}</p>
                        <p><strong>Email:</strong> {currentUser?.email}</p>
                        <p><strong>Téléphone:</strong> {currentUser?.telephone}</p>
                        <p><strong>Spécialité:</strong> {currentUser?.specialite}</p> 
                        {/* Ajoutez d'autres informations du professionnel ici */}
                    </div>
                );
            case 'disponibilites':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Gestion de mes Disponibilités
                            <button 
                                onClick={openAddDispoModal} 
                                className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200"
                            >
                                + Ajouter une disponibilité
                            </button>
                        </h2>
                        
                        {disponibilites.length === 0 ? (
                            <p className="text-gray-600">Aucune disponibilité enregistrée pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure Début</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure Fin</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {disponibilites.map(dispo => (
                                            <tr key={dispo.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.heureDebut}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispo.heureFin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        dispo.reservee ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {dispo.reservee ? 'Réservée' : 'Disponible'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => openEditDispoModal(dispo)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteDispo(dispo.id)}
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
                    </div>
                );
            case 'reservations':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mes Réservations Reçues</h2>
                        <p className="text-gray-600">
                            Contenu pour la gestion des réservations reçues par le professionnel (à implémenter).
                        </p>
                    </div>
                );
            case 'consultations':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mes Consultations Passées</h2>
                        <p className="text-gray-600">
                            Contenu pour l'historique des consultations du professionnel (à implémenter).
                        </p>
                    </div>
                );
            case 'profil':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Modifier mon Profil</h2>
                        <p className="text-gray-600">
                            Contenu pour la modification du profil du professionnel (à implémenter, similaire à FormulaireProfil pour l'utilisateur).
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto font-sans">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Tableau de Bord Professionnel ({roleFr})
                </h1>

                {globalError && ( // Affiche les erreurs globales en dehors du modal
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {globalError}
                    </div>
                )}
                {message && ( // Affiche les messages de succès/erreur spécifiques aux opérations
                    <div className={`mb-4 px-4 py-2 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Barre d'onglets */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('informations')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'informations'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mes Informations
                        </button>
                        <button
                            onClick={() => setActiveTab('disponibilites')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'disponibilites'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mes Disponibilités
                        </button>
                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'reservations'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mes Réservations
                        </button>
                        <button
                            onClick={() => setActiveTab('consultations')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'consultations'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mes Consultations
                        </button>
                        <button
                            onClick={() => setActiveTab('profil')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'profil'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Modifier mon Profil
                        </button>
                    </nav>
                </div>

                {/* Contenu des onglets */}
                {renderSection()}

                {/* Modal pour Ajouter/Modifier une Disponibilité (reste en dehors de renderSection car c'est un overlay) */}
                {showDispoModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{currentDispo ? "Modifier la disponibilité" : "Ajouter une nouvelle disponibilité"}</h3>
                            <form onSubmit={handleAddOrUpdateDispo} className="space-y-4">
                                <div>
                                    <label htmlFor="dispoDate" className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        id="dispoDate"
                                        value={dispoDate}
                                        onChange={(e) => setDispoDate(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dispoHeureDebut" className="block text-sm font-medium text-gray-700">Heure de début</label>
                                    <input
                                        type="time"
                                        id="dispoHeureDebut"
                                        value={dispoHeureDebut}
                                        onChange={(e) => setDispoHeureDebut(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dispoHeureFin" className="block text-sm font-medium text-gray-700">Heure de fin</label>
                                    <input
                                        type="time"
                                        id="dispoHeureFin"
                                        value={dispoHeureFin}
                                        onChange={(e) => setDispoHeureFin(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                {globalError && <p className="text-red-500 text-sm">{globalError}</p>} {/* Affiche l'erreur du modal */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => { setShowDispoModal(false); resetDispoForm(); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {currentDispo ? "Modifier" : "Ajouter"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TableauProfessionnel;
