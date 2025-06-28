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

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [statut, setStatut] = useState(true);
  const [premium, setPremium] = useState(false);
  const [lienFichier, setLienFichier] = useState('');
  const [categorie, setCategorie] = useState('');
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);

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
      setFormVisible(false);
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
    setFormVisible(true);
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
      document.getElementById('excelFileInput').value = null;
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

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
          <FontAwesomeIcon icon={faFileImport} />
          <span>Importer des fonctionnalités depuis un fichier Excel</span>
        </h2>

        <div className="flex items-center space-x-4">
          <input
            id="excelFileInput"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
          <button
            onClick={handleImport}
            disabled={importLoading || !excelFile}
            className={`btn btn-primary px-6 py-2 rounded-md shadow-sm text-white ${importLoading || !excelFile ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {importLoading ? 'Importation...' : 'Importer'}
          </button>
        </div>

        {importMessage && <div className="mt-3 text-green-700 font-medium">{importMessage}</div>}
        {importError && <div className="mt-3 text-red-700 font-medium">{importError}</div>}
      </div>

      {error && <div className="alert alert-danger alert-dismissible fade show">{error}<button type="button" className="btn-close" onClick={() => setError(null)}></button></div>}
      {successMessage && <div className="alert alert-success alert-dismissible fade show">{successMessage}<button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button></div>}

      {!formVisible && (
        <div className="mb-4 flex justify-end">
          <button className="px-6 py-2 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 flex items-center" onClick={() => { resetForm(); setFormVisible(true); }}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une fonctionnalité
          </button>
        </div>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="border rounded px-3 py-2" required />
            <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="border rounded px-3 py-2" />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2" />
            <input type="text" placeholder="Lien Fichier" value={lienFichier} onChange={(e) => setLienFichier(e.target.value)} className="border rounded px-3 py-2" />
            <input type="text" placeholder="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="border rounded px-3 py-2" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={statut} onChange={(e) => setStatut(e.target.checked)} />
              <span>Statut actif</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
              <span>Premium</span>
            </label>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow">{editId ? 'Modifier' : 'Ajouter'}</button>
            <button type="button" onClick={() => setFormVisible(false)} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 shadow">Annuler</button>
          </div>
        </form>
      )}

      {/* Tableau des fonctionnalités ... (inchangé) */}
    </div>
  );
}

export default AdminFonctionnalites;
