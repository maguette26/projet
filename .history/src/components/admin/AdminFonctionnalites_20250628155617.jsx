// src/pages/AdminFonctionnalites.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Importe l'instance 'api' centralisée
import { logout } from '../../services/serviceAuth'; // Importe la fonction de déconnexion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Ajout de faPlus pour un bouton d'ajout clair

function AdminFonctionnalites() {
    // États pour les fonctionnalités
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // États pour le formulaire d'ajout/modification
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [statut, setStatut] = useState(true); // true pour actif, false pour inactif
    const [premium, setPremium] = useState(false);
    const [lienFichier, setLienFichier] = useState(''); // Pour les URLs de vidéos/podcasts/outils
    const [categorie, setCategorie] = useState(''); // Pour une organisation supplémentaire si nécessaire
    const [editId, setEditId] = useState(null);

    // États pour les informations de l'utilisateur connecté
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);

    // Effet pour récupérer les informations de l'utilisateur au chargement du composant
    useEffect(() => {
        fetchUserInfo();
    }, []);

    /**
     * Récupère les informations de l'utilisateur connecté (email et rôle).
     * Lance également la récupération des fonctionnalités après avoir obtenu les infos utilisateur.
     */
    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/auth/me'); 
            setRole(res.data.role);
            setEmail(res.data.email);
            fetchFonctionnalites(); // Récupère les fonctionnalités une fois l'utilisateur identifié
        } catch (err) {
            console.error("Erreur lors de la récupération des infos utilisateur:", err);
            setError("Erreur lors de la récupération des informations utilisateur.");
            setLoading(false); 
        }
    };

    /**
     * Gère la déconnexion de l'utilisateur en utilisant la fonction 'logout' du service d'authentification.
     */
    const handleLogout = async () => {
        try {
            await logout(); 
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            setError("Erreur lors de la déconnexion.");
        }
    };

    /**
     * Récupère la liste des fonctionnalités depuis l'API.
     */
    const fetchFonctionnalites = async () => {
        setError(null); 
        try {
            const res = await api.get('/fonctionnalites'); 
            if (Array.isArray(res.data)) {
                setFonctionnalites(res.data);
            } else {
                throw new Error("Format de données inattendu de l'API.");
            }
        } catch (err) {
            handleApiError(err, "Erreur lors du chargement des fonctionnalités.");
        } finally {
            setLoading(false); 
        }
    };

    /**
     * Gère les erreurs renvoyées par l'API.
     * Fournit des messages d'erreur spécifiques en fonction du statut HTTP.
     * @param {object} err - L'objet erreur Axios.
     * @param {string} defaultMessage - Message d'erreur par défaut si aucun message spécifique n'est trouvé.
     */
    const handleApiError = (err, defaultMessage) => {
        console.error("Erreur API:", err);
        if (err.response) {
            switch (err.response.status) {
                case 403:
                    setError("Accès refusé : Vous n'avez pas les permissions nécessaires.");
                    break;
                case 401:
                    setError("Session expirée ou non autorisée. Veuillez vous reconnecter.");
                    break;
                case 404: 
                    setError("La ressource demandée n'a pas été trouvée. Vérifiez l'URL ou si le backend est démarré.");
                    break;
                default:
                    setError(err.response.data?.message || defaultMessage);
            }
        } else if (err.request) {
            setError("Aucune réponse du serveur. Vérifiez votre connexion internet ou si le backend est démarré et accessible.");
        } else {
            setError(err.message || defaultMessage);
        }
    };

    /**
     * Réinitialise les champs du formulaire et les messages d'état.
     */
    const resetForm = () => {
        setNom('');
        setDescription('');
        setType('');
        setStatut(true); 
        setPremium(false);
        setLienFichier('');
        setCategorie('');
        setEditId(null); 
        setError(null);
        setSuccessMessage(null);
    };

    /**
     * Gère la soumission du formulaire (ajout ou modification d'une fonctionnalité).
     * @param {object} e - L'événement de soumission du formulaire.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom.trim()) {
            setError("Le nom de la fonctionnalité est obligatoire.");
            return;
        }

        const payload = { 
            nom, 
            description, 
            type, 
            statut, 
            premium,
            lienFichier: lienFichier.trim() !== '' ? lienFichier.trim() : null, // Envoyer null si vide
            categorie: categorie.trim() !== '' ? categorie.trim() : null // Envoyer null si vide
        };

        try {
            if (editId) {
                await api.put(/fonctionnalites/${editId}, payload); 
                setSuccessMessage("Fonctionnalité modifiée avec succès !");
            } else {
                await api.post('/fonctionnalites', payload); 
                setSuccessMessage("Fonctionnalité ajoutée avec succès !");
            }
            resetForm(); 
            fetchFonctionnalites(); 
        } catch (err) {
            handleApiError(err, "Erreur lors de l'enregistrement de la fonctionnalité.");
        }
    };

    /**
     * Prépare le formulaire pour l'édition d'une fonctionnalité.
     * @param {object} f - L'objet fonctionnalité à éditer.
     */
    const handleEdit = (f) => {
        setNom(f.nom || '');
        setDescription(f.description || '');
        setType(f.type || '');
        setStatut(!!f.statut); 
        setPremium(!!f.premium); 
        setLienFichier(f.lienFichier || '');
        setCategorie(f.categorie || '');
        setEditId(f.id); 
        setError(null);
        setSuccessMessage(null);
    };

    /**
     * Gère la suppression d'une fonctionnalité.
     * @param {string} id - L'ID de la fonctionnalité à supprimer.
     */
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) {
            return;
        }
        try {
            await api.delete(/fonctionnalites/${id}); 
            setSuccessMessage("Fonctionnalité supprimée avec succès !");
            fetchFonctionnalites(); 
        } catch (err) {
            handleApiError(err, "Erreur lors de la suppression de la fonctionnalité.");
        }
    };

    // Affiche un message d'accès refusé si l'utilisateur n'est pas ADMIN
    if (role && role !== "ADMIN") {
        return (
            <div className="alert alert-danger mt-5 text-center">
                Vous n'avez pas la permission d'accéder à cette page.
            </div>
        );
    }

    // Affiche un message de chargement pendant la récupération initiale des données
    if (loading) {
        return <div className="text-center my-5">Chargement des fonctionnalités...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Fonctionnalités</h1>

            

            {/* Affichage des messages d'erreur */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {/* Affichage des messages de succès */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                </div>
            )}

            {/* Formulaire d'ajout/modification de fonctionnalité */}
            <form onSubmit={handleSubmit} className="mb-4 card p-4 shadow-md rounded-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">{editId ? 'Modifier une fonctionnalité' : 'Ajouter une fonctionnalité'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                        <input type="text" className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
                        <select className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" id="type" value={type} onChange={(e) => setType(e.target.value)} required>
                            <option value="">Sélectionnez un type...</option>
                            <option value="citation">Citation</option>
                            <option value="podcast">Podcast</option>
                            <option value="article">Article</option>
                            <option value="video">Vidéo</option>
                            <option value="outil">Outil interactif</option>
                            <option value="guide_pratique">Guide Pratique</option>
                            <option value="journaling_prompt">Prompt Journaling</option>
                            <option value="exercice_texte">Exercice de Relaxation (texte)</option>
                            <option value="challenge">Défi Bien-être</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">Catégorie (Optionnel)</label>
                        <input type="text" className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} placeholder="Ex: Méditation, Sommeil" />
                    </div>
                    <div className="col-span-full"> {/* Prend toute la largeur sur mobile et desktop */}
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Contenu</label>
                        <textarea className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description détaillée ou contenu de la ressource"></textarea>
                    </div>
                    <div className="col-span-full"> {/* Prend toute la largeur */}
                        <label htmlFor="lienFichier" className="block text-sm font-medium text-gray-700">Lien du Fichier (URL pour Vidéo/Podcast/Outil, optionnel)</label>
                        <input type="url" className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" id="lienFichier" value={lienFichier} onChange={(e) => setLienFichier(e.target.value)} placeholder="Ex: https://youtube.com/ma-video" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="form-check form-switch flex items-center">
                            <input className="form-check-input h-5 w-9 rounded-full bg-gray-200 checked:bg-indigo-600 focus:ring-indigo-500" type="checkbox" role="switch" id="actif" checked={statut} onChange={() => setStatut(!statut)} />
                            <label className="form-check-label ml-2 text-gray-700" htmlFor="actif">Actif</label>
                        </div>
                        <div className="form-check form-switch flex items-center">
                            <input className="form-check-input h-5 w-9 rounded-full bg-gray-200 checked:bg-yellow-500 focus:ring-yellow-500" type="checkbox" role="switch" id="premium" checked={premium} onChange={() => setPremium(!premium)} />
                            <label className="form-check-label ml-2 text-gray-700" htmlFor="premium">Premium</label>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button type="submit" className="btn btn-primary me-2 px-6 py-2 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FontAwesomeIcon icon={editId ? faPencilAlt : faPlus} className="mr-2" />
                        {editId ? 'Modifier' : 'Ajouter'}
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary px-6 py-2 rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" onClick={resetForm}>Annuler</button>
                    )}
                </div>
            </form>

            {/* Tableau d'affichage des fonctionnalités */}
            {fonctionnalites.length === 0 ? (
                <div className="alert alert-info text-center mt-4 p-4 rounded-lg shadow-sm">Aucune fonctionnalité trouvée.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien Fichier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {fonctionnalites.map((f) => (
                                <tr key={f.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.type}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">{f.description}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-blue-600">{f.lienFichier}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.categorie || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${f.statut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}}>
                                            {f.statut ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${f.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}}>
                                            {f.premium ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => handleEdit(f)} aria-label={Modifier ${f.nom}}>
                                            <FontAwesomeIcon icon={faPencilAlt} className="mr-1" /> Modifier
                                        </button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(f.id)} aria-label={Supprimer ${f.nom}}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Supprimer
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
}

export default AdminFonctionnalites;