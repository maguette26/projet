import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormulaireDisponibilite from '../components/professionel/FormulaireDisponibilite';
import Messagerie from '../components/professionel/Messagerie';




const TableauProfessionnel = () => {
    // 'tableauDeBord' est la section par défaut au chargement
    const [activeSection, setActiveSection] = useState('tableauDeBord');
    const navigate = useNavigate();

    // Gère la déconnexion du professionnel
    const handleLogout = () => {
        localStorage.removeItem('token'); // Supprime le token d'authentification
        localStorage.removeItem('role');  // Supprime le rôle stocké
        navigate('/connexion');           // Redirige l'utilisateur vers la page de connexion
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
                            <div className="bg-orange-100 p-4 rounded-md text-orange-800">Disponibilités définies: 12</div>
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
                        {/* Le composant FormulaireDisponibilite est bien appelé ici */}
                        <FormulaireDisponibilite /> 
                    </section>
                );
            case 'messagerie':
                return (
                    <section className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ma Messagerie</h2>
                        {/* Le composant Messagerie est bien appelé ici */}
                        <Messagerie/> 
                    </section>
                );
            // Ajoutez d'autres sections si nécessaire (ex: "Mes patients", "Historique")
            default:
                return <div className="p-6 text-center text-gray-600">Sélectionnez une option dans le menu latéral.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar (Barre latérale de navigation) */}
            <aside className="w-64 bg-green-700 text-white flex flex-col h-full shadow-lg"> {/* Couleur différente pour distinguer */}
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
                                {/* Icône SVG pour le Tableau de bord */}
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 00-1 1v2a1 1 0 001 1h2m-6-6h-2a1 1 0 00-1 1v2a1 1 0 001 1h2"></path></svg>
                                Tableau de bord
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'disponibilites' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('disponibilites')}
                            >
                                {/* Icône SVG pour les Disponibilités (exemple: calendrier) */}
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Mes disponibilités
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${activeSection === 'messagerie' ? 'bg-green-600 text-white' : 'hover:bg-green-800'}`}
                                onClick={() => setActiveSection('messagerie')}
                            >
                                {/* Icône SVG pour la Messagerie */}
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Messagerie
                            </button>
                        </li>
                        {/* Ajoutez d'autres boutons pour d'autres sections spécifiques aux professionnels */}
                    </ul>
                </nav>
                <div className="p-4 border-t border-green-600 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-green-600 hover:bg-green-800 text-white py-2 rounded-md transition duration-200 flex items-center justify-center"
                    >
                        {/* Icône SVG pour la Déconnexion */}
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Se Déconnecter
                    </button>
                    {/* Le bouton "Réduire" est conservé comme placeholder si sa fonctionnalité n'est pas implémentée */}
                    {/* <button className="w-full bg-green-600 hover:bg-green-800 text-white py-2 mt-2 rounded-md transition duration-200 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                        Réduire
                    </button> */}
                </div>
            </aside>

            {/* Main Content Area (Zone de contenu principal) */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200 shadow-sm">
                    {/* Titre dynamique de la section affichée */}
                    <h1 className="text-3xl font-bold text-gray-800">
                        {activeSection === 'disponibilites' ? 'Gestion des Disponibilités' :
                         activeSection === 'tableauDeBord' ? 'Tableau de Bord Professionnel' :
                         activeSection === 'messagerie' ? 'Messagerie' :
                         'Espace Professionnel'}
                    </h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {/* Ici, le composant approprié est rendu en fonction de la section active */}
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default TableauProfessionnel;