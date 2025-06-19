// src/components/admin/GestionProfessionnels.jsx
import React, { useEffect, useState } from 'react';
import { getProfessionnels, downloadDocumentJustificatif, validateProfessionnel } from '../../services/serviceAdmin';
import api from '../../services/api'; 
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const GestionProfessionnels = () => {
    const [professionnels, setProfessionnels] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentAdminEmail, setCurrentAdminEmail] = useState(null);
    const [currentAdminRole, setCurrentAdminRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfoAndProfessionnels();
    }, []);

    const fetchUserInfoAndProfessionnels = async () => {
        try {
            const res = await api.get('/auth/me'); 
            const fetchedRole = res.data.role;
            setCurrentAdminEmail(res.data.email);
            setCurrentAdminRole(fetchedRole);

            if (fetchedRole === 'ADMIN') {
                await fetchProfessionnels();
            } else {
                setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
                handleLogoutAndRedirect();
            }
        } catch (err) {
            setError("Erreur lors de la récupération des informations utilisateur. Veuillez vous reconnecter.");
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogoutAndRedirect();
            }
        }
    };

    const handleLogoutAndRedirect = async () => {
        try {
            await logout(); 
            navigate('/connexion');
        } catch (err) {
            navigate('/connexion'); 
        }
    };

    const fetchProfessionnels = async () => {
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await getProfessionnels();
            const filteredAndCategorizedProfessionnels = data.filter(p => 
                p.role === 'PSYCHOLOGUE' || p.role === 'PSYCHIATRE'
            );
            setProfessionnels(filteredAndCategorizedProfessionnels);
        } catch (err) {
            setError("Impossible de charger les professionnels. " + (err.response?.data?.message || err.message));
        }
    };

    const handleValidation = async (id, valide) => {
        setError(null);
        setSuccessMessage(null);
        try {
            await validateProfessionnel(id, valide);
            setSuccessMessage(`Professionnel ${valide ? 'validé' : 'refusé'} avec succès !`);
            setProfessionnels(prev =>
                prev.map(p =>
                    p.id === id ? { ...p, statutValidation: valide ? 'VALIDE' : 'REFUSE' } : p
                )
            );
        } catch (err) {
            setError(`Échec de la ${valide ? 'validation' : 'réfutation'} du professionnel.`);
        }
    };

    const handleDownloadDocument = async (filename) => {
        if (!filename) {
            setError("Aucun nom de fichier fourni pour le téléchargement.");
            return;
        }
        setError(null);
        try {
            const blob = await downloadDocumentJustificatif(filename);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            setSuccessMessage(`Document '${filename}' téléchargé avec succès.`);
        } catch (err) {
            setError("Échec du téléchargement du document. Le fichier n'existe peut-être pas ou l'accès est refusé.");
        }
    };

    const renderProfessionnelTable = (filteredList, title, showActions = true) => (
        <>
            <h3 className="text-xl font-semibold mt-8 mb-4">{title} ({filteredList.length})</h3>
            {filteredList.length === 0 ? (
                <p className="text-gray-600 mb-6">Aucun professionnel dans cette catégorie.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 mb-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Nom Prénom</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Spécialité</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Document</th>
                                {showActions && <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredList.map((pro, idx) => (
                                <tr key={pro.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-8 py-5 whitespace-nowrap text-gray-900 font-medium">{pro.nom} {pro.prenom}</td>
                                    <td className="px-8 py-5 whitespace-nowrap text-gray-700">{pro.email}</td>
                                    <td className="px-8 py-5 whitespace-nowrap text-gray-700">{pro.telephone || 'N/A'}</td>
                                    <td className="px-8 py-5 whitespace-nowrap text-gray-700 capitalize">{pro.specialite || 'N/A'}</td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            pro.statutValidation === 'EN_ATTENTE' ? 'bg-yellow-200 text-yellow-800' :
                                            pro.statutValidation === 'VALIDE' ? 'bg-green-200 text-green-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {pro.statutValidation.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {pro.documentJustificatif ? (
                                            <button 
                                                onClick={() => handleDownloadDocument(pro.documentJustificatif)} 
                                                className="text-indigo-600 hover:text-indigo-900 transition"
                                                title="Télécharger"
                                            >
                                                <FontAwesomeIcon icon={faDownload} size="lg" />
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-5 text-center space-x-4">
                                            {(pro.statutValidation === 'EN_ATTENTE' || pro.statutValidation === 'REFUSE') ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleValidation(pro.id, true)} 
                                                        className="text-green-600 hover:text-green-900 transition"
                                                        title="Valider"
                                                    >
                                                        <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                                    </button>
                                                    {pro.statutValidation === 'EN_ATTENTE' && (
                                                        <button 
                                                            onClick={() => handleValidation(pro.id, false)} 
                                                            className="text-red-600 hover:text-red-900 transition"
                                                            title="Refuser"
                                                        >
                                                            <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-xs">Déjà validé</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    if (error && error.includes("Accès refusé") && currentAdminRole !== 'ADMIN') {
        return (
            <div className="text-red-600 text-center p-4 bg-red-100 rounded-md">
                {error}
                <p className="mt-2">Veuillez vous assurer d'être connecté avec un compte administrateur.</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center p-4 bg-red-100 rounded-md">{error}</div>;
    }

    const professionnelsEnAttente = professionnels.filter(p => p.statutValidation === 'EN_ATTENTE');
    const professionnelsValides = professionnels.filter(p => p.statutValidation === 'VALIDE');
    const professionnelsRefuses = professionnels.filter(p => p.statutValidation === 'REFUSE');

    return (
        <div className="p-4">
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}

            {renderProfessionnelTable(professionnelsEnAttente, "Professionnels en attente de validation", true)}
            {renderProfessionnelTable(professionnelsValides, "Professionnels validés", false)}
            {renderProfessionnelTable(professionnelsRefuses, "Professionnels refusés", true)}
        </div>
    );
};

export default GestionProfessionnels;
