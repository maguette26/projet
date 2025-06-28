import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

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

    const payload = { nom, description, type, statut, premium, lienFichier, categorie };

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

  if (role && role !== "ADMIN") {
    return <div className="text-center mt-10 text-red-600 font-bold">Accès refusé.</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Fonctionnalités</h1>
        {!formVisible && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow flex items-center font-semibold"
            onClick={() => {
              resetForm();
              setFormVisible(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une fonctionnalité
          </motion.button>
        )}
      </div>

      {formVisible && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 bg-white rounded-2xl shadow-2xl max-w-3xl mx-auto border border-indigo-200"
        >
          <h2 className="text-xl font-bold text-indigo-700 mb-6 text-center">Ajouter / Modifier une Fonctionnalité</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lien Fichier</label>
              <input type="text" value={lienFichier} onChange={(e) => setLienFichier(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
              <input type="text" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2 flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={statut} onChange={() => setStatut(!statut)} />
                <span className="text-sm font-medium">Actif</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={premium} onChange={() => setPremium(!premium)} />
                <span className="text-sm font-medium">Premium</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={() => { resetForm(); setFormVisible(false); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow">
              Annuler
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

export default AdminFonctionnalites;
