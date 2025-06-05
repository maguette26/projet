import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';


const TableauUtilisateur = () => {
    const [activeSection, setActiveSection] = useState('tableauDeBord'); // Défaut sur l'aperçu du tableau de bord
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/connexion');
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'tableauDeBord':
                return (
                    // Padding réduit de p-6 à p-4
                    <div className="p-4 bg-white rounded-lg shadow">
                        {/* Titre réduit de text-2xl à text-xl */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Aperçu de votre Espace</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* Espacement réduit de gap-4 à gap-3 */}
                            <div className="bg-purple-100 p-3 rounded-md text-purple-800 text-sm">Dernière humeur: Heureux 😊</div> {/* Padding et texte réduits */}
                            <div className="bg-orange-100 p-3 rounded-md text-orange-800 text-sm">Prochain RDV: 25 Mai 🗓️</div> {/* Padding et texte réduits */}
                            {/* Ajoutez d'autres widgets personnalisés ici */}
                        </div>
                    </div>
                );
            case 'profil':
                return (
                    // Padding réduit de p-6 à p-4
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        {/* Titre réduit de text-xl sm:text-2xl à text-lg sm:text-xl */}
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Modifier votre profil
                        </h2>
                        <FormulaireProfil />
                    </section>
                );
            case 'suiviHumeur':
                return (
                    // Padding réduit de p-6 à p-4
                    <section className="bg-white shadow-lg rounded-lg p-4">
                        {/* Titre réduit de text-xl sm:text-2xl à text-lg sm:text-xl */}
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Suivi de votre humeur
                        </h2>
                        <SuiviHumeur />
                    </section>
                );
            default:
                return <div className="p-4 text-center text-gray-600">Sélectionnez une option dans le menu latéral.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-60 bg-indigo-700 text-white flex flex-col h-full shadow-lg"> {/* Largeur réduite de w-64 à w-60 */}
                <div className="p-4 text-center text-xl font-bold border-b border-indigo-600"> {/* Padding et texte réduits */}
                    <span className="text-indigo-200">Psy</span><span className="text-white">Connect</span> Utilisateur
                </div>
                <nav className="flex-grow mt-4"> {/* Marge réduite */}
                    <ul>
                        <li className="mb-1"> {/* Marge réduite */}
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
                    </ul>
                </nav>
                <div className="p-3 border-t border-indigo-600 mt-auto"> {/* Padding réduit */}
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
                <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm"> {/* Padding réduit */}
                    {/* Titre dynamique de la section affichée (taille de police réduite) */}
                    <h1 className="text-2xl font-bold text-gray-800"> {/* Réduit de text-3xl à text-2xl */}
                        {activeSection === 'profil' ? 'Mon Profil' :
                            activeSection === 'suiviHumeur' ? "Mon Suivi d'Humeur" :
                                activeSection === 'tableauDeBord' ? 'Aperçu du Tableau de Bord Utilisateur' :
                                    'Espace Utilisateur'}
                    </h1>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4"> {/* Padding réduit */}
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default TableauUtilisateur;