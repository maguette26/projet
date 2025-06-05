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

const TableauProfessionnel = () => {
    const [activeSection, setActiveSection] = useState('tableauDeBord');
    const [disponibilites, setDisponibilites] = useState([]); // État pour stocker les disponibilités
    const [disponibiliteAModifier, setDisponibiliteAModifier] = useState(null); // Pour l'édition
    const navigate = useNavigate();

    // Fonction pour charger les disponibilités au montage du composant et quand nécessaire
    const fetchDisponibilites = async () => {
        try {
            const data = await getDisponibilites();
            setDisponibilites(data);
        } catch (error) {
            console.error("Erreur lors du chargement des disponibilités :", error);
            // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
            alert("Impossible de charger les disponibilités.");
        }
    };

    useEffect(() => {
        // Charger les disponibilités uniquement si la section est 'disponibilites'
        if (activeSection === 'disponibilites') {
            fetchDisponibilites();
        }
    }, [activeSection]); // Déclencher le rechargement si la section change

    // Gère la soumission du formulaire d'ajout/modification de disponibilité
    const handleSaveDisponibilite = async (dispoData) => {
        try {
            if (disponibiliteAModifier) {
                // Modification
                await modifierDisponibilite(disponibiliteAModifier.id, dispoData);
                alert("Disponibilité modifiée avec succès !");
            } else {
                // Ajout
                await ajouterDisponibilite(dispoData);
                alert("Disponibilité ajoutée avec succès !");
            }
            fetchDisponibilites(); // Recharger la liste des disponibilités après ajout/modification
            setDisponibiliteAModifier(null); // Réinitialiser le formulaire
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la disponibilité :", error);
            // Gérer l'erreur (ex: afficher un message spécifique si déjà existant, etc.)
            alert("Erreur lors de la sauvegarde de la disponibilité : " + (error.response?.data || error.message));
        }
    };

    // Gère la suppression d'une disponibilité
    const handleDeleteDisponibilite = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?")) {
            try {
                await supprimerDisponibilite(id);
                alert("Disponibilité supprimée avec succès !");
                fetchDisponibilites(); // Recharger la liste
            } catch (error) {
                console.error("Erreur lors de la suppression de la disponibilité :", error);
                alert("Erreur lors de la suppression de la disponibilité : " + (error.response?.data || error.message));
            }
        }
    };

    // Gère la déconnexion du professionnel
    const handleLogout = () => {
        localStorage.removeItem('role'); // Supprime le rôle stocké
        // Ici, vous devriez également appeler une API de déconnexion si votre backend a une telle route
        // Par exemple: await serviceAuth.logout();
        navigate('/connexion'); // Redirige l'utilisateur vers la page de connexion
    };

    // Fonction pour rendre le composant de la section active
    const renderSection = () => {
        switch (activeSection) {
            case 'tableauDeBord':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aperçu de votre Tableau de Bord</h2>
                        {/* Contenu de l'aperçu du tableau de bord du professionnel */}
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