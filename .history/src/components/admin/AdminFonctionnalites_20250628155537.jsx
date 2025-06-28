import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faTrash,
  faPlus,
  faFileImport,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

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
      fetchFonctionnalites();
    } catch (err) {
      setError("Erreur lors de la récupération des informations utilisateur.");
      setLoading(false);
    }
  };

  const fetchFonctionnalites = async () => {
    setError(null);
    try {
      const res = await api.get('/fonctionnalites');
      setFonctionnalites(res.data);
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
      lienFichier: lienFichier || null,
      categorie: categorie || null,
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
      handleApiError(err, "Erreur lors de l'enregistrement.");
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
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette fonctionnalité ?")) return;
    try {
      await api.delete(`/fonctionnalites/${id}`);
      setSuccessMessage("Fonctionnalité supprimée !");
      fetchFonctionnalites();
    } catch (err) {
      handleApiError(err, "Erreur lors de la suppression.");
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setImportMessage(null);
    setImportError(null);
  };

  const handleImport = async () => {
    if (!excelFile) {
      setImportError("Veuillez choisir un fichier Excel.");
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      setImportLoading(true);
      const res = await api.post('/import/fonctionnalites', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportMessage(res.data || "Importation réussie !");
      setExcelFile(null);
      fetchFonctionnalites();
    } catch (err) {
      setImportError("Erreur lors de l'importation.");
    } finally {
      setImportLoading(false);
    }
  };

  if (role && role !== "ADMIN") {
    return <div className="text-red-600 font-semibold text-center mt-10">Accès refusé.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Gestion des Fonctionnalités</h1>

      {/* Import Excel */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileImport} /> Importer depuis Excel
        </h2>
        <div className="flex gap-4">
          <input
            id="excelFileInput"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleImport}
            disabled={importLoading || !excelFile}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {importLoading ? "Importation..." : "Importer"}
          </button>
        </div>
        {importMessage && <p className="text-green-600 mt-2">{importMessage}</p>}
        {importError && <p className="text-red-600 mt-2">{importError}</p>}
      </div>

      {/* Alertes */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

      {/* Bouton d'ajout */}
      {!formVisible && (
        <div className="mb-4 text-right">
          <button
            onClick={() => {
              resetForm();
              setFormVisible(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-medium flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} /> Ajouter une fonctionnalité
          </button>
        </div>
      )}

      {/* Formulaire */}
      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md mb-6 space-y-4 border"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Formulaire</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Lien Fichier"
              value={lienFichier}
              onChange={(e) => setLienFichier(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={statut} onChange={() => setStatut(!statut)} />
              Actif
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={premium} onChange={() => setPremium(!premium)} />
              Premium
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {editId ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormVisible(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des fonctionnalités */}
      {fonctionnalites.length === 0 ? (
        <p className="text-center text-gray-600">Aucune fonctionnalité trouvée.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Lien</th>
                <th className="px-4 py-2">Catégorie</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Premium</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fonctionnalites.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{f.id}</td>
                  <td className="px-4 py-2">{f.nom}</td>
                  <td className="px-4 py-2">{f.type}</td>
                  <td className="px-4 py-2">{f.description}</td>
                  <td className="px-4 py-2">
                    {f.lienFichier ? (
                      <a href={f.lienFichier} className="text-indigo-600 underline" target="_blank" rel="noreferrer">
                        Voir
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2">{f.categorie || '-'}</td>
                  <td className="px-4 py-2">{f.statut ? 'Actif' : 'Inactif'}</td>
                  <td className="px-4 py-2">{f.premium ? 'Oui' : 'Non'}</td>
                  <td className="px-4 py-2 flex justify-center gap-4">
                    <button onClick={() => handleEdit(f)} className="text-indigo-600 hover:text-indigo-900">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800">
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
