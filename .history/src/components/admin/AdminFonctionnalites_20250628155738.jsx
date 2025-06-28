// src/pages/AdminFonctionnalites.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

function AdminFonctionnalites() {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [statut, setStatut] = useState(true);
  const [premium, setPremium] = useState(false);
  const [lienFichier, setLienFichier] = useState('');
  const [categorie, setCategorie] = useState('');
  const [editId, setEditId] = useState(null);

  const [role, setRole] = useState(null);

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
    try {
      const res = await api.get('/fonctionnalites');
      setFonctionnalites(res.data);
    } catch (err) {
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

    const payload = { nom, description, type, statut, premium, lienFichier: lienFichier || null, categorie: categorie || null };

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
      setError("Erreur lors de l'enregistrement de la fonctionnalité.");
    }
  };

  const handleEdit = (f) => {
    setNom(f.nom);
    setDescription(f.description);
    setType(f.type);
    setStatut(f.statut);
    setPremium(f.premium);
    setLienFichier(f.lienFichier);
    setCategorie(f.categorie);
    setEditId(f.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) return;
    try {
      await api.delete(`/fonctionnalites/${id}`);
      setSuccessMessage("Fonctionnalité supprimée avec succès !");
      fetchFonctionnalites();
    } catch (err) {
      setError("Erreur lors de la suppression de la fonctionnalité.");
    }
  };

  if (role && role !== "ADMIN") {
    return <div className="alert alert-danger mt-5 text-center">Accès refusé.</div>;
  }

  if (loading) {
    return <div className="text-center my-5">Chargement en cours...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-3xl font-bold text-center mb-4">Gestion des Fonctionnalités</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="mb-4 flex justify-end">
        <button
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => { setFormVisible(!formVisible); resetForm(); }}
        >
          <FontAwesomeIcon icon={formVisible ? faTimes : faPlus} className="mr-2" />
          {formVisible ? 'Fermer le formulaire' : 'Ajouter une fonctionnalité'}
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Nom</label>
              <input className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
            </div>
            <div>
              <label>Type</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value)} required>
                <option value="">-- Sélectionner --</option>
                <option value="citation">Citation</option>
                <option value="podcast">Podcast</option>
                <option value="article">Article</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
            <div>
              <label>Description</label>
              <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
              <label>Lien fichier</label>
              <input className="form-control" value={lienFichier} onChange={e => setLienFichier(e.target.value)} />
            </div>
            <div>
              <label>Catégorie</label>
              <input className="form-control" value={categorie} onChange={e => setCategorie(e.target.value)} />
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="mt-4 text-right">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded shadow">
              <FontAwesomeIcon icon={editId ? faPencilAlt : faPlus} className="mr-2" />
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      {fonctionnalites.length === 0 ? (
        <p className="text-center text-gray-500">Aucune fonctionnalité trouvée.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Premium</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fonctionnalites.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{f.nom}</td>
                  <td className="border px-4 py-2">{f.type}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.statut ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {f.statut ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.premium ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {f.premium ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button onClick={() => handleEdit(f)} className="text-indigo-600 hover:text-indigo-900">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-900">
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