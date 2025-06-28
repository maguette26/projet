import React, { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { logout } from '../../services/serviceAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function AdminFonctionnalites() {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [statut, setStatut] = useState(true);
    const [premium, setPremium] = useState(false);
    const [lienFichier, setLienFichier] = useState('');
    const [categorie, setCategorie] = useState('');
    const [editId, setEditId] = useState(null);

    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);

    // Etat pour afficher/masquer le formulaire
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Gestion disparition automatique des messages succès après 3s
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/auth/me'); 
            setRole(res.data.role);
            setEmail(res.data.email);
            fetchFonctionnalites();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la récupération des informations utilisateur.");
            setLoading(false); 
        }
    };

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
        // On ne reset pas successMessage ici pour éviter de le masquer immédiatement
    };

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
            lienFichier: lienFichier.trim() !== '' ? lienFichier.trim() : null,
            categorie: categorie.trim() !== '' ? categorie.trim() : null
        };

        try {
            if (editId) {
                await api.put(`/fonctionnalites/${editId}`, payload);
                setSuccessMessage("Fonctionnalité modifiée avec succès !");
            } else {
                await api.post('/fonctionnalites', payload);
                setSuccessMessage("Fonctionnalité ajoutée avec succès !");
            }
            resetForm();
            setShowForm(false); // Cache le formulaire après soumission réussie
            fetchFonctionnalites();
        } catch (err) {
            handleApiError(err, "Erreur lors de l'enregistrement de la fonctionnalité.");
        }
    };

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
        setShowForm(true); // Affiche le formulaire en mode édition
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) return;
        try {
            await api.delete(`/fonctionnalites/${id}`);
            setSuccessMessage("Fonctionnalité supprimée avec succès !");
            fetchFonctionnalites();
        } catch (err) {
            handleApiError(err, "Erreur lors de la suppression de la fonctionnalité.");
        }
    };

    if (role && role !== "ADMIN") {
        return (
            <div className="alert alert-danger mt-5 text-center">
                Vous n'avez pas la permission d'accéder à cette page.
            </div>
        );
    }

    if (loading) {
        return <div className="text-center my-5">Chargement des fonctionnalités...</div>;
    }

    return (
        <div className="container mt-8 max-w-7xl px-4">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Gestion des Fonctionnalités</h1>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mb-4">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                </div>
            )}

            {/* Bouton pour afficher le formulaire d'ajout */}
            {!showForm && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Ajouter une fonctionnalité
                    </button>
                </div>
            )}

            {/* Formulaire d'ajout/modification de fonctionnalité */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="mb-6 text-2xl font-semibold text-gray-700">{editId ? 'Modifier une fonctionnalité' : 'Ajouter une fonctionnalité'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
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
                            <input
                                type="text"
                                id="categorie"
                                value={categorie}
                                onChange={(e) => setCategorie(e.target.value)}
                                placeholder="Ex: Méditation, Sommeil"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Contenu</label>
                        <textarea
                            id="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description détaillée ou contenu de la ressource"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="lienFichier" className="block text-sm font-medium text-gray-700 mb-1">Lien du Fichier (URL pour Vidéo/Podcast/Outil, optionnel)</label>
                        <input
                            type="url"
                            id="lienFichier"
                            value={lienFichier}
                            onChange={(e) => setLienFichier(e.target.value)}
                            placeholder="Ex: https://youtube.com/ma-video"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center space-x-8 mt-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={statut}
                                onChange={() => setStatut(!statut)}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Actif</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={premium}
                                onChange={() => setPremium(!premium)}
                                className="form-checkbox h-5 w-5 text-yellow-500"
                            />
                            <span className="ml-2 text-gray-700">Premium</span>
                        </label>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <FontAwesomeIcon icon={editId ? faPencilAlt : faPlus} className="mr-2" />
                            {editId ? 'Modifier' : 'Ajouter'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}
                            className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            )}

            {fonctionnalites.length === 0 ? (
                <div className="text-center p-6 bg-blue-50 rounded-md shadow-sm text-blue-700">Aucune fonctionnalité trouvée.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-5 py-3 text-left text-sm font-semibold">ID</th>
                                <th className="px-5 py-3 text-left text-sm font-semibold">Nom</th>
                                <th className="px-5 py-3 text-left text-sm font-semibold">Type</th>
                                <th className="px-5 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="px-5 py-3 text-left text-sm font-semibold">Lien Fichier</th>
                                <th className="px-5 py-3 text-left text-sm font-semibold">Catégorie</th>
                                <th className="px-5 py-3 text-center text-sm font-semibold">Statut</th>
                                <th className="px-5 py-3 text-center text-sm font-semibold">Premium</th>
                                <th className="px-5 py-3 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fonctionnalites.map((f) => (
                                <tr key={f.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 text-sm text-gray-900">{f.id}</td>
                                    <td className="px-5 py-4 text-sm text-gray-900">{f.nom}</td>
                                    <td className="px-5 py-4 text-sm text-gray-900">{f.type}</td>
                                    <td className="px-5 py-4 max-w-xs truncate text-sm text-gray-600">{f.description}</td>
                                    <td className="px-5 py-4 max-w-xs truncate text-sm text-blue-600">{f.lienFichier}</td>
                                    <td className="px-5 py-4 text-sm text-gray-900">{f.categorie || '-'}</td>
                                    <td className="px-5 py-4 text-center text-sm">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${f.statut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {f.statut ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${f.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {f.premium ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm space-x-3">
                                        <button
                                            onClick={() => handleEdit(f)}
                                            aria-label={`Modifier ${f.nom}`}
                                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                            style={{ outline: 'none' }}
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f.id)}
                                            aria-label={`Supprimer ${f.nom}`}
                                            className="text-red-600 hover:text-red-900 focus:outline-none"
                                            style={{ outline: 'none' }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" />
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
