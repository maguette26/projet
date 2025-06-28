import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';

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
    } catch {
      setError("Erreur lors de la récupération des informations utilisateur.");
      setLoading(false);
    }
  };

  const fetchFonctionnalites = async () => {
    try {
      const res = await api.get('/fonctionnalites');
      setFonctionnalites(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Erreur lors du chargement des fonctionnalités.");
    } finally {
      setLoading(false);
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
    } catch {
      setError("Erreur lors de l'enregistrement de la fonctionnalité.");
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
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await api.delete(`/fonctionnalites/${id}`);
        setSuccessMessage("Fonctionnalité supprimée avec succès !");
        fetchFonctionnalites();
      } catch {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setImportMessage(null);
    setImportError(null);
  };

  const handleImport = async () => {
    if (!excelFile) {
      setImportError("Veuillez sélectionner un fichier Excel.");
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
      document.getElementById('excelFileInput').value = null;
      fetchFonctionnalites();
    } catch (err) {
      setImportError("Erreur lors de l'importation.");
    } finally {
      setImportLoading(false);
    }
  };

  if (role && role !== "ADMIN") {
    return <div className="text-center mt-10 text-red-600 font-bold">Accès refusé.</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="container mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestion des Fonctionnalités</h1>

      {/* Import Excel */}
      <div className="mb-6 p-4 bg-gray-50 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2"><FontAwesomeIcon icon={faFileImport} className="mr-2" />Import Excel</h2>
        <div className="flex items-center space-x-4">
          <input id="excelFileInput" type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
          <button onClick={handleImport} disabled={importLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            {importLoading ? "Importation..." : "Importer"}
          </button>
        </div>
        {importMessage && <p className="text-green-600 mt-2">{importMessage}</p>}
        {importError && <p className="text-red-600 mt-2">{importError}</p>}
      </div>

      {/* Message d'erreur/succès */}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {successMessage && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>}

      {/* Bouton Ajouter */}
      {!formVisible && (
        <div className="mb-4 flex justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" onClick={() => { resetForm(); setFormVisible(true); }}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une fonctionnalité
          </button>
        </div>
      )}

      {/* Formulaire */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Nom *</label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-semibold">Type</label>
              <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3}></textarea>
            </div>
            <div>
              <label className="block font-semibold">Lien fichier</label>
              <input type="text" value={lienFichier} onChange={(e) => setLienFichier(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold">Catégorie</label>
              <input type="text" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2 flex space-x-6 items-center mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={statut} onChange={() => setStatut(!statut)} />
                <span>Actif</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={premium} onChange={() => setPremium(!premium)} />
                <span>Premium</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={() => { resetForm(); setFormVisible(false); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des fonctionnalités */}
      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full text-sm text-left bg-white border">
          <thead className="bg-blue-600 text-white">
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
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{f.id}</td>
                <td className="px-4 py-2">{f.nom}</td>
                <td className="px-4 py-2">{f.type}</td>
                <td className="px-4 py-2">{f.description}</td>
                <td className="px-4 py-2 text-blue-600 underline">{f.lienFichier ? <a href={f.lienFichier} target="_blank" rel="noreferrer">Lien</a> : '-'}</td>
                <td className="px-4 py-2">{f.categorie || '-'}</td>
                <td className="px-4 py-2">{f.statut ? 'Actif' : 'Inactif'}</td>
                <td className="px-4 py-2">{f.premium ? 'Oui' : 'Non'}</td>
                <td className="px-4 py-2 text-center space-x-3">
                  <button onClick={() => handleEdit(f)} className="text-indigo-600 hover:text-indigo-800"><FontAwesomeIcon icon={faPencilAlt} /></button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFonctionnalites;
