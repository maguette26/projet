// src/pages/AdminFonctionnalites.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Importe l'instance 'api' centralisée
import { logout } from '../../services/serviceAuth'; // Importe la fonction de déconnexion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

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
            // L'URL est relative à la baseURL de api.js, qui est '/api'.
            // Donc, cela devient /api/auth/me, qui est ensuite proxifié.
            const res = await api.get('/auth/me'); 
            setRole(res.data.role);
            setEmail(res.data.email);
            fetchFonctionnalites(); // Récupère les fonctionnalités une fois l'utilisateur identifié
        } catch (err) {
            // L'intercepteur de api.js gère déjà la redirection pour les 401
            console.error("Erreur lors de la récupération des infos utilisateur:", err);
            setError("Erreur lors de la récupération des informations utilisateur.");
            setLoading(false); // Arrête le chargement même en cas d'erreur
        }
    };

    /**
     * Gère la déconnexion de l'utilisateur en utilisant la fonction 'logout' du service d'authentification.
     */
    const handleLogout = async () => {
        try {
            await logout(); // Appel de la fonction de déconnexion centralisée
            // La redirection est gérée par la fonction logout elle-même (ou son intercepteur)
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            setError("Erreur lors de la déconnexion.");
        }
    };

    /**
     * Récupère la liste des fonctionnalités depuis l'API.
     */
    const fetchFonctionnalites = async () => {
        setError(null); // Réinitialise les erreurs précédentes
        try {
            // CHANGEMENT ICI : Suppression du slash final pour GET /fonctionnalites
            const res = await api.get('/fonctionnalites'); 
            if (Array.isArray(res.data)) {
                setFonctionnalites(res.data);
            } else {
                throw new Error("Format de données inattendu de l'API.");
            }
        } catch (err) {
            handleApiError(err, "Erreur lors du chargement des fonctionnalités.");
        } finally {
            setLoading(false); // Arrête le chargement une fois les données récupérées (ou en cas d'erreur)
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
                case 404: // Ce cas est maintenant le plus pertinent pour votre problème actuel
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
        setStatut(true); // Par défaut actif
        setPremium(false);
        setEditId(null); // Annule le mode édition
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
            statut, // statut est déjà un booléen
            premium 
        };

        try {
            if (editId) {
                // L'URL est relative à la baseURL de api.js, qui est '/api'.
                // Donc, cela devient /api/fonctionnalites/{id}, qui est ensuite proxifié.
                await api.put(`/fonctionnalites/${editId}`, payload); 
                setSuccessMessage("Fonctionnalité modifiée avec succès !");
            } else {
                // CHANGEMENT ICI : Suppression du slash final pour POST /fonctionnalites
                await api.post('/fonctionnalites', payload); 
                setSuccessMessage("Fonctionnalité ajoutée avec succès !");
            }
            resetForm(); // Réinitialise le formulaire
            fetchFonctionnalites(); // Rafraîchit la liste des fonctionnalités
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
        setStatut(!!f.statut); // Assure que statut est un booléen
        setPremium(!!f.premium); // Assure que premium est un booléen
        setEditId(f.id); // Définit l'ID pour le mode édition
        setError(null);
        setSuccessMessage(null);
    };

    /**
     * Gère la suppression d'une fonctionnalité.
     * @param {string} id - L'ID de la fonctionnalité à supprimer.
     */
    const handleDelete = async (id) => {
        // Demande de confirmation avant suppression (utilisez un modal personnalisé en production)
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) {
            return;
        }
        try {
            // L'URL est relative à la baseURL de api.js, qui est '/api'.
            // Donc, cela devient /api/fonctionnalites/{id}, qui est ensuite proxifié.
            await api.delete(`/fonctionnalites/${id}`); 
            setSuccessMessage("Fonctionnalité supprimée avec succès !");
            fetchFonctionnalites(); // Rafraîchit la liste
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
            {/* Informations de l'utilisateur connecté */}
            

            {email && <p>Connecté en tant que : <strong>{email}</strong> (Rôle : {role})</p>}

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
            <form onSubmit={handleSubmit} className="mb-4 card p-3 shadow-sm">
                <h3 className="mb-3">{editId ? 'Modifier une fonctionnalité' : 'Ajouter une fonctionnalité'}</h3>
                <div className="row g-3 align-items-end">
                    <div className="col-md-2">
                        <label htmlFor="nom" className="form-label">Nom</label>
                        <input type="text" className="form-control" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div className="col-md-5">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select className="form-select" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Sélectionnez...</option>
                            <option value="citation">Citation</option>
                            <option value="podcast">Podcast</option>
                            <option value="article">Article</option>
                            <option value="video">Vidéo</option>
                            <option value="outil">Outil interactif</option>
                        </select>
                    </div>
                    <div className="col-md-1 d-flex justify-content-center align-items-center">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="actif" checked={statut} onChange={() => setStatut(!statut)} />
                            <label className="form-check-label" htmlFor="actif">Actif</label>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex justify-content-start align-items-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="prime" checked={premium} onChange={() => setPremium(!premium)} />
                            <label className="form-check-label" htmlFor="prime">Premium</label>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <button type="submit" className="btn btn-primary me-2">
                        {editId ? 'Modifier' : 'Ajouter'}
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Annuler</button>
                    )}
                </div>
            </form>

            {/* Tableau d'affichage des fonctionnalités */}
            {fonctionnalites.length === 0 ? (
                <div className="alert alert-info text-center mt-4">Aucune fonctionnalité trouvée.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle shadow-sm">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Statut</th>
                                <th>Premium</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fonctionnalites.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td>{f.nom}</td>
                                    <td>{f.description}</td>
                                    <td>{f.type}</td>
                                    <td>
                                        <span className={`badge ${f.statut ? 'bg-success' : 'bg-secondary'}`}>
                                            {f.statut ? 'active' : 'inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        {f.premium ? (
                                            <span className="badge bg-warning text-dark">Oui</span>
                                        ) : (
                                            <span className="badge bg-info text-dark">Non</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(f)} aria-label={`Modifier ${f.nom}`}>
                                            <FontAwesomeIcon icon={faPencilAlt} /> Modifier
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f.id)} aria-label={`Supprimer ${f.nom}`}>
                                            <FontAwesomeIcon icon={faTrash} /> Supprimer
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
