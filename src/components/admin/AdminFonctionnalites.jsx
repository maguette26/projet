import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

function AdminFonctionnalites() {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [statut, setStatut] = useState('active');
    const [premium, setPremium] = useState(false);
    const [editId, setEditId] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const interceptor = axios.interceptors.request.use(config => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            config.headers['Content-Type'] = 'application/json';
            return config;
        });
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [token]);

    const fetchFonctionnalites = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/fonctionnalites');
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

    const handleApiError = (err, defaultMessage) => {
        console.error("Erreur API:", err);
        if (err.response) {
            switch (err.response.status) {
                case 403:
                    setError("Accès refusé : Vous n'avez pas les permissions nécessaires.");
                    break;
                case 401:
                    setError("Session expirée, veuillez vous reconnecter.");
                    break;
                case 404:
                    setError("La ressource demandée n'a pas été trouvée. Assurez-vous que le backend est en cours d'exécution et que l'URL est correcte.");
                    break;
                default:
                    setError(err.response.data?.message || defaultMessage);
            }
        } else if (err.request) {
            setError("Aucune réponse du serveur. Vérifiez votre connexion internet.");
        } else {
            setError(err.message || defaultMessage);
        }
    };

    useEffect(() => {
        fetchFonctionnalites();
    }, []);

    const resetForm = () => {
        setNom('');
        setDescription('');
        setType('');
        setStatut('active');
        setPremium(false);
        setEditId(null);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom.trim()) {
            setError("Le nom de la fonctionnalité est obligatoire.");
            return;
        }
        const payload = { nom, description, type, statut, premium };
        try {
            if (editId) {
                await axios.put(`/api/fonctionnalites/${editId}`, payload);
                setSuccessMessage("Fonctionnalité modifiée avec succès !");
            } else {
                await axios.post('/api/fonctionnalites', payload);
                setSuccessMessage("Fonctionnalité ajoutée avec succès !");
            }
            resetForm();
            fetchFonctionnalites();
        } catch (err) {
            handleApiError(err, "Erreur lors de l'enregistrement de la fonctionnalité.");
        }
    };

    const handleEdit = (f) => {
        setNom(f.nom || '');
        setDescription(f.description || '');
        setType(f.type || '');
        setStatut(f.statut || 'active');
        setPremium(f.premium || false);
        setEditId(f.id);
        setError(null);
        setSuccessMessage(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) {
            return;
        }
        try {
            await axios.delete(`/api/fonctionnalites/${id}`);
            setSuccessMessage("Fonctionnalité supprimée avec succès !");
            fetchFonctionnalites();
        } catch (err) {
            handleApiError(err, "Erreur lors de la suppression de la fonctionnalité.");
        }
    };

    if (loading) {
        return <div className="text-center my-5">Chargement des fonctionnalités...</div>;
    }

    return (
        <div className="container mt-5">
            {error && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
                    <span>{error}</span>
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)} aria-label="Close"></button>
                </div>
            )}

            {/* Formulaire d'ajout/modification de fonctionnalité */}
            <form onSubmit={handleSubmit} className="mb-4 card p-3 shadow-sm">
                <h3 className="mb-3">{editId ? 'Modifier une fonctionnalité' : 'Ajouter une fonctionnalité'}</h3>
                {/* La classe 'row' et les 'col-md-*' créent des colonnes horizontales */}
                <div className="row g-3 align-items-end">
                    <div className="col-md-2"> {/* Colonne pour "Nom" */}
                        <label htmlFor="nom" className="form-label">Nom</label>
                        <input type="text" className="form-control" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div className="col-md-5"> {/* Colonne pour "Description" */}
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="col-md-2"> {/* Colonne pour "Taper" (Type) */}
                        <label htmlFor="type" className="form-label">Taper</label>
                        <select className="form-select" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Sélectionnez...</option>
                            <option value="citation">Citation</option>
                            <option value="podcast">Podcast</option>
                            <option value="article">Article</option>
                            <option value="video">Vidéo</option>
                            <option value="outil">Outil interactif</option>
                        </select>
                    </div>
                    <div className="col-md-1 d-flex justify-content-center align-items-center"> {/* Colonne pour "Actif" */}
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="actif" checked={statut === 'active'} onChange={() => setStatut(statut === 'active' ? 'inactive' : 'active')} />
                            <label className="form-check-label" htmlFor="actif">Actif</label>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex justify-content-start align-items-center"> {/* Colonne pour "Prime" */}
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="prime" checked={premium} onChange={() => setPremium(!premium)} />
                            <label className="form-check-label" htmlFor="prime">Prime</label>
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

            {/* Tableau des fonctionnalités existantes */}
            {fonctionnalites.length === 0 ? (
                <div className="alert alert-info text-center mt-4">Aucune fonctionnalité trouvée.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle shadow-sm">
                        <thead className="table-light">
                            <tr>
                                <th>IDENTIFIANT</th>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Taper</th>
                                <th>Statut</th>
                                <th>Prime</th>
                                <th className="text-center">Actes</th>
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
                                        <span className={`badge ${f.statut === 'active' ? 'bg-success' : 'bg-info'}`}>
                                            {f.statut === 'active' ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                    <td>{f.premium ? 'Oui' : 'Non'}</td>
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