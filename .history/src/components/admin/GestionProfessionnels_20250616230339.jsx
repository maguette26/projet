import React, { useEffect, useState } from 'react';
import { getProfessionnels, downloadDocumentJustificatif, validateProfessionnel } from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { CheckCircle, XCircle, Download, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GestionProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentAdminEmail, setCurrentAdminEmail] = useState(null);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfoAndProfessionnels();
  }, []);

  const fetchUserInfoAndProfessionnels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/auth/me');
      const fetchedRole = res.data.role;
      setCurrentAdminEmail(res.data.email);
      setCurrentAdminRole(fetchedRole);

      if (fetchedRole === 'ADMIN') {
        await fetchProfessionnels();
      } else {
        setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
        setLoading(false);
        handleLogoutAndRedirect();
      }
    } catch (err) {
      setError("Erreur lors de la récupération des informations utilisateur.");
      setLoading(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogoutAndRedirect();
      }
    }
  };

  const handleLogoutAndRedirect = async () => {
    try {
      await logout();
      navigate('/connexion');
    } catch (err) {
      navigate('/connexion');
    }
  };

  const fetchProfessionnels = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await getProfessionnels();
      const filtered = data.filter(p => p.role === 'PSYCHOLOGUE' || p.role === 'PSYCHIATRE');
      setProfessionnels(filtered);
    } catch (err) {
      setError("Impossible de charger les professionnels.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (id, valide) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await validateProfessionnel(id, valide);
      setSuccessMessage(`Professionnel ${valide ? 'validé' : 'refusé'} avec succès !`);
      await fetchProfessionnels();
    } catch (err) {
      setError("Échec de la validation/réfutation du professionnel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (filename) => {
    if (!filename) return setError("Aucun fichier fourni.");
    try {
      const blob = await downloadDocumentJustificatif(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccessMessage(`Document '${filename}' téléchargé.`);
    } catch (err) {
      setError("Échec du téléchargement du document.");
    }
  };

  const getSpecialiteBadge = (specialite) => {
    const base = "inline-block px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch ((specialite || '').toLowerCase()) {
      case 'psychologue':
        return <span className={`${base} bg-violet-100 text-violet-700`}>Psychologue</span>;
      case 'psychiatre':
        return <span className={`${base} bg-blue-100 text-blue-700`}>Psychiatre</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>Non spécifié</span>;
    }
  };

  const filteredProfessionnels = professionnels.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchQuery = (
      p.nom.toLowerCase().includes(query) ||
      p.prenom.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query)
    );
    const matchStatus = statusFilter === 'ALL' || p.statutValidation === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border rounded shadow-sm"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="VALIDE">Validé</option>
          <option value="REFUSE">Refusé</option>
        </select>
      </div>

      {successMessage && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{successMessage}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-32 text-indigo-600">
          <Loader className="animate-spin mr-2" /> Chargement...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Nom Prénom</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-left">Spécialité</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-center">Document</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {filteredProfessionnels.map(pro => (
                <tr key={pro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pro.nom} {pro.prenom}</td>
                  <td className="px-6 py-4">{pro.email}</td>
                  <td className="px-6 py-4">{pro.telephone || 'N/A'}</td>
                  <td className="px-6 py-4">{getSpecialiteBadge(pro.specialite)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pro.statutValidation === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                      pro.statutValidation === 'VALIDE' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}
                    >
                      {pro.statutValidation.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pro.documentJustificatif ? (
                      <button
                        onClick={() => handleDownloadDocument(pro.documentJustificatif)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Télécharger"
                      >
                        <Download className="w-5 h-5 mx-auto" />
                      </button>
                    ) : <span className="text-gray-400">N/A</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pro.statutValidation === 'EN_ATTENTE' ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleValidation(pro.id, true)} className="text-green-600 hover:text-green-800" title="Valider">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleValidation(pro.id, false)} className="text-red-600 hover:text-red-800" title="Refuser">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">Déjà traité</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionProfessionnels;
