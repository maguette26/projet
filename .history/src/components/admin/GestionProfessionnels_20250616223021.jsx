// src/components/admin/GestionProfessionnels.jsx
import React, { useEffect, useState } from 'react';
import { getProfessionnels, downloadDocumentJustificatif, validateProfessionnel } from '../../services/serviceAdmin';
import api from '../../services/api'; 
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const GestionProfessionnels = () => {
    const [professionnels, setProfessionnels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentAdminEmail, setCurrentAdminEmail] = useState(null);
    const [currentAdminRole, setCurrentAdminRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfoAndProfessionnels();
    }, []);

    const fetchUserInfoAndProfessionnels = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("GestionProfessionnels: Tentative de récupération des infos utilisateur (/auth/me)...");
            const res = await api.get('/auth/me'); 
            console.log("GestionProfessionnels: Réponse de /auth/me:", res.data);

            const fetchedRole = res.data.role;
            setCurrentAdminEmail(res.data.email);
            setCurrentAdminRole(fetchedRole);

            if (fetchedRole === 'ADMIN') {
                console.log("GestionProfessionnels: Rôle ADMIN confirmé. Récupération des professionnels...");
                await fetchProfessionnels();
            } else {
                console.warn(`GestionProfessionnels: Accès non autorisé. Rôle détecté: '${fetchedRole}'.`);
                setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
                setLoading(false);
                handleLogoutAndRedirect();
            }
        } catch (err) {
            console.error("GestionProfessionnels: Erreur lors de la récupération des infos utilisateur:", err.response?.data || err.message, err);
            setError("Erreur lors de la récupération des informations utilisateur. Veuillez vous reconnecter.");
            setLoading(false);
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
            console.error("GestionProfessionnels: Erreur lors de la déconnexion:", err);
            navigate('/connexion'); 
        }
    };

    const fetchProfessionnels = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await getProfessionnels();
            console.log("GestionProfessionnels: Données brutes des professionnels reçues:", data);
            
            const filteredAndCategorizedProfessionnels = data.filter(p => 
                p.role === 'PSYCHOLOGUE' || 
                p.role === 'PSYCHIATRE' 
             
            );
            
            setProfessionnels(filteredAndCategorizedProfessionnels);
            console.log("GestionProfessionnels: Professionnels filtrés pour affichage:", filteredAndCategorizedProfessionnels);
        } catch (err) {
            console.error("GestionProfessionnels: Erreur lors de la récupération des professionnels:", err.response?.data || err.message);
            setError("Impossible de charger les professionnels. " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleValidation = async (id, valide) => {
        console.log(`GestionProfessionnels: Tenter de ${valide ? 'valider' : 'refuser'} le professionnel avec ID: ${id}`);
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await validateProfessionnel(id, valide);
            setSuccessMessage(`Professionnel ${valide ? 'validé' : 'refusé'} avec succès !`);
            await fetchProfessionnels(); // Recharger la liste après modification
        } catch (err) {
            // AJOUTS ICI POUR UN DIAGNOSTIC PRÉCIS
            console.error("GestionProfessionnels: Erreur complète capturée dans handleValidation:", err); 
            console.error("GestionProfessionnels: Détails de l'erreur (err.response?.data):", err.response?.data); 
            console.error("GestionProfessionnels: Message de l'erreur (err.message):", err.message); 
            // FIN AJOUTS

            setError(`Échec de la ${valide ? 'validation' : 'réfutation'} du professionnel.`);
            // Vous pouvez commenter la ligne ci-dessus et décommenter celle-ci pour afficher le message exact du backend
            // setError(`Échec: ${err.response?.data || err.message}`); 
        } finally {
            setLoading(false);
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
            console.error("GestionProfessionnels: Erreur lors du téléchargement du document:", err.response?.data || err.message);
            setError("Échec du téléchargement du document. Le fichier n'existe peut-être pas ou l'accès est refusé.");
        }
    };

    const renderProfessionnelTable = (filteredList, title, showActions = true) => (
        <>
            <h3 className="text-xl font-semibold mt-8 mb-4">{title} ({filteredList.length})</h3>
            {filteredList.length === 0 ? (
                <p className="text-gray-600">Aucun professionnel dans cette catégorie.</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg mb-8">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Prénom</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                {showActions && <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredList.map(pro => (
                                <tr key={pro.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pro.nom} {pro.prenom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pro.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pro.telephone || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{pro.specialite || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            pro.statutValidation === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                            pro.statutValidation === 'VALIDE' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {pro.statutValidation ? pro.statutValidation.replace('_', ' ') : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {pro.documentJustificatif ? (
                                            <button 
                                                onClick={() => handleDownloadDocument(pro.documentJustificatif)} 
                                                className="text-indigo-600 hover:text-indigo-900 mx-2"
                                                title="Télécharger le document"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {pro.statutValidation === 'EN_ATTENTE' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleValidation(pro.id, true)} 
                                                        className="text-green-600 hover:text-green-900 mx-2"
                                                        title="Valider"
                                                    >
                                                        <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleValidation(pro.id, false)} 
                                                        className="text-red-600 hover:text-red-900 mx-2"
                                                        title="Refuser"
                                                    >
                                                        <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-xs">Déjà traité</span>
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-indigo-600" />
                <p className="ml-3 text-gray-600">Chargement des informations...</p>
            </div>
        );
    }

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

            {renderProfessionnelTable(professionnelsRefuses, "Professionnels refusés", false)}
        </div>
    );
};

export default GestionProfessionnels;