import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus, faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';

function AdminFonctionnalites() {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // États formulaire ajout/modif
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [statut, setStatut] = useState(true);
  const [premium, setPremium] = useState(false);
  const [lienFichier, setLienFichier] = useState('');
  const [categorie, setCategorie] = useState('');
  const [editId, setEditId] = useState(null);

  // Pour masquer/afficher le formulaire
  const [formVisible, setFormVisible] = useState(false);

  // Infos utilisateur
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);

  // Import Excel
  const [excelFile, setExcelFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState(null);
  const [importError, setImportError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get('/auth/me');
      setRole(res.data.role);
      setEmail(res.data.email);
      fetchFonctionnalites();
    } catch (err) {
      setError("Erreur lors de la récupération des informations utilisateur.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError("Erreur lors de la déconnexion.");
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
    if (err.response) {
      switch (err.response.status) {
        case 403:
          setError("Accès refusé : Vous n'avez pas les permissions nécessaires.");
          break;
        case 401:
          setError("Session expirée ou non autorisée. Veuillez vous reconnecter.");
          break;
        case 404:
          setError("La ressource demandée n'a pas été trouvée.");
          break;
        default:
          setError(err.response.data?.message || defaultMessage);
      }
    } else if (err.request) {
      setError("Aucune réponse du serveur. Vérifiez votre connexion ou si le backend est démarré.");
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
    setSuccessMessage(null);
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
      categorie: categorie.trim() !== '' ? categorie.trim() : null,
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
      setFormVisible(false); // cacher formulaire après ajout/modif
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
    setFormVisible(true); // Afficher formulaire en mode édition
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

  // Gestion import Excel
  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setImportMessage(null);
    setImportError(null);
  };

  const handleImport = async () => {
    if (!excelFile) {
      setImportError("Veuillez sélectionner un fichier Excel avant d'importer.");
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      setImportLoading(true);
      setImportError(null);
      setImportMessage(null);

      const res = await api.post('/import/fonctionnalites', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImportMessage(res.data || "Importation réussie !");
      setExcelFile(null);
      fetchFonctionnalites();
    } catch (err) {
      const msg = err.response?.data || "Erreur lors de l'importation. Vérifiez le fichier.";
      setImportError(msg);
    } finally {
      setImportLoading(false);
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
    <div className="container mt-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Fonctionnalités</h1>

      {/* Bloc Import Excel */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
          <FontAwesomeIcon icon={faFileImport} />
          <span>Importer des fonctionnalités depuis un fichier Excel</span>
        </h2>

        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700
            "
          />
          <button
            onClick={handleImport}
            disabled={importLoading || !excelFile}
            className={`btn btn-primary px-6 py-2 rounded-md shadow-sm text-white ${
              importLoading || !excelFile
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {importLoading ? 'Importation...' : 'Importer'}
          </button>
        </div>

        {importMessage && (
          <div className="mt-3 text-green-700 font-medium">{importMessage}</div>
        )}

        {importError && (
          <div className="mt-3 text-red-700 font-medium">{importError}</div>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Messages de succès */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
          ></button>
        </div>
      )}

      {/* Bouton Ajouter */}
      {!formVisible && (
        <div className="mb-4 flex justify-end">
          <button
            className="btn btn-success px-6 py-2 rounded-md shadow-sm text-white flex items-center hover:bg-green-700"
            onClick={() => {
              resetForm();
              setFormVisible(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Ajouter une fonctionnalité
          </button>
        </div>
      )}

      {/* Formulaire Ajout / Modification */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-4 card p-4 shadow-md rounded-lg border border-gray-300">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">
            {editId ? 'Modifier une fonctionnalité' : 'Ajouter une fonctionnalité'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
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
              <label
                htmlFor="categorie"
                className="block text-sm font-medium text-gray-700"
              >
                Catégorie (Optionnel)
              </label>
              <input
                type="text"
                className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                placeholder="Ex: Méditation, Sommeil"
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description / Contenu
              </label>
              <textarea
                className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée ou contenu de la ressource"
              ></textarea>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="lienFichier"
                className="block text-sm font-medium text-gray-700"
              >
                Lien du Fichier (URL pour Vidéo/Podcast/Outil, optionnel)
              </label>
              <input
                type="url"
                className="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="lienFichier"
                value={lienFichier}
                onChange={(e) => setLienFichier(e.target.value)}
                placeholder="Ex: https://youtube.com/ma-video"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="form-check form-switch flex items-center">
                <input
                  className="form-check-input h-5 w-9 rounded-full bg-gray-200 checked:bg-indigo-600 focus:ring-indigo-500"
                  type="checkbox"
                  role="switch"
                  id="actif"
                  checked={statut}
                  onChange={() => setStatut(!statut)}
                />
                <label
                  className="form-check-label ml-2 text-gray-700"
                  htmlFor="actif"
                >
                  Actif
                </label>
              </div>

              <div className="form-check form-switch flex items-center">
                <input
                  className="form-check-input h-5 w-9 rounded-full bg-gray-200 checked:bg-yellow-500 focus:ring-yellow-500"
                  type="checkbox"
                  role="switch"
                  id="premium"
                  checked={premium}
                  onChange={() => setPremium(!premium)}
                />
                <label
                  className="form-check-label ml-2 text-gray-700"
                  htmlFor="premium"
                >
                  Premium
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
            >
              <FontAwesomeIcon
                icon={editId ? faPencilAlt : faPlus}
                className="mr-2"
              />
              {editId ? 'Modifier' : 'Ajouter'}
            </button>

            <button
              type="button"
              className="btn btn-secondary px-4 py-2 rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 flex items-center"
              onClick={() => {
                resetForm();
                setFormVisible(false);
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des fonctionnalités */}
      {fonctionnalites.length === 0 ? (
        <div className="alert alert-info text-center mt-4 p-4 rounded-lg shadow-sm">
          Aucune fonctionnalité trouvée.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-50">
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
            <tbody>
              {fonctionnalites.map(f => (
                <tr key={f.id} className="hover:bg-gray-100">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.id}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.nom}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.type}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.description}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600 underline">
                    {f.lienFichier ? (
                      <a href={f.lienFichier} target="_blank" rel="noreferrer">
                        Voir lien
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.categorie || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.statut ? 'Actif' : 'Inactif'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{f.premium ? 'Oui' : 'Non'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(f)}
                      title="Modifier"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      title="Supprimer"
                      className="text-red-600 hover:text-red-900"
                    >
                      <FontAwesomeIcon icon={faTrash} />
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
