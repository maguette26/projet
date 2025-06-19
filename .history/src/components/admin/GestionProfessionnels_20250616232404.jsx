import React, { useEffect, useState } from 'react';
import {
  getProfessionnels,
  downloadDocumentJustificatif,
  validateProfessionnel,
} from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faDownload,
  faMagnifyingGlass,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const GestionProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('TOUS'); // TOUS, EN_ATTENTE, VALIDE, REFUSE
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // clé et direction du tri
  const [error, setError] = useState(null);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfoAndProfessionnels();
  }, []);

  const fetchUserInfoAndProfessionnels = async () => {
    try {
      const res = await api.get('/auth/me');
      const fetchedRole = res.data.role;
      setCurrentAdminRole(fetchedRole);

      if (fetchedRole === 'ADMIN') {
        await fetchProfessionnels();
      } else {
        setError("Accès refusé.");
        handleLogoutAndRedirect();
      }
    } catch (err) {
      handleLogoutAndRedirect();
    }
  };

  const handleLogoutAndRedirect = async () => {
    try {
      await logout();
    } finally {
      navigate('/connexion');
    }
  };

  const fetchProfessionnels = async () => {
    try {
      const data = await getProfessionnels();
      const filtered = data.filter(p =>
        ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(p.role)
      );
      setProfessionnels(filtered);
    } catch (err) {
      setError("Erreur lors du chargement des professionnels.");
    }
  };

  const handleValidation = async (id, valide) => {
    try {
      await validateProfessionnel(id, valide);
      setProfessionnels(prev =>
        prev.map(p =>
          p.id === id ? { ...p, statutValidation: valide ? 'VALIDE' : 'REFUSE' } : p
        )
      );
    } catch {
      setError("Erreur de validation.");
    }
  };

  const handleDownloadDocument = async (filename) => {
    if (!filename) return;
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
    } catch {
      setError("Erreur de téléchargement.");
    }
  };

  // Recherche par nom, prenom, email, specialite
  const filteredProfessionnels = professionnels.filter(pro => {
    const term = searchTerm.toLowerCase();
    return (
      (pro.nom?.toLowerCase().includes(term)) ||
      (pro.prenom?.toLowerCase().includes(term)) ||
      (pro.email?.toLowerCase().includes(term)) ||
      (pro.specialite?.toLowerCase().includes(term))
    );
  }).filter(pro => {
    if (filterStatut === 'TOUS') return true;
    return pro.statutValidation === filterStatut;
  });

  // Fonction de tri
  const sortedProfessionnels = React.useMemo(() => {
    if (!sortConfig.key) return filteredProfessionnels;
    const sorted = [...filteredProfessionnels].sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

      // Cas particulier statutValidation pour trier alphabétiquement
      if (sortConfig.key === 'statutValidation') {
        aKey = aKey || '';
        bKey = bKey || '';
      } else {
        // Si string, comparer en minuscules
        if (typeof aKey === 'string') aKey = aKey.toLowerCase();
        if (typeof bKey === 'string') bKey = bKey.toLowerCase();
      }

      if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredProfessionnels, sortConfig]);

  // Handle click sur entête pour tri
  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Icône tri colonne
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <FontAwesomeIcon icon={faSort} className="text-gray-400 ml-1" />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="text-gray-600 ml-1" />;
    return <FontAwesomeIcon icon={faSortDown} className="text-gray-600 ml-1" />;
  };

  if (error && currentAdminRole !== 'ADMIN') {
    return (
      <div className="text-red-600 text-center p-4 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Barre de recherche */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou spécialité..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Filtre par statut */}
      <div className="flex justify-center space-x-4 mb-6">
        {['TOUS', 'EN_ATTENTE', 'VALIDE', 'REFUSE'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatut(status)}
            className={`px-4 py-2 rounded-md font-semibold border
              ${filterStatut === status
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
            `}
          >
            {status === 'TOUS' ? 'Tous' :
             status === 'EN_ATTENTE' ? 'En attente' :
             status === 'VALIDE' ? 'Validés' :
             'Refusés'}
          </button>
        ))}
      </div>

      {/* Tableau amélioré */}
      {sortedProfessionnels.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">Aucun professionnel correspondant.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {[
                  { label: 'Nom Prénom', key: 'nom' },
                  { label: 'Email', key: 'email' },
                  { label: 'Téléphone', key: 'telephone' },
                  { label: 'Spécialité', key: 'specialite' },
                  { label: 'Statut', key: 'statutValidation' },
                  { label: 'Document', key: null },
                  { label: 'Actions', key: null },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase select-none ${
                      col.key ? 'cursor-pointer hover:text-indigo-600' : ''
                    }`}
                    onClick={col.key ? () => requestSort(col.key) : undefined}
                    title={col.key ? `Trier par ${col.label}` : undefined}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {col.key && <SortIcon columnKey={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProfessionnels.map((pro, idx) => (
                <tr key={pro.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-8 py-5 whitespace-nowrap font-medium text-gray-900">
                    {pro.nom} {pro.prenom}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-gray-700">{pro.email}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-gray-700">{pro.telephone || 'N/A'}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-gray-700 capitalize">{pro.specialite || 'N/A'}</td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        pro.statutValidation === 'EN_ATTENTE'
                          ? 'bg-yellow-200 text-yellow-900'
                          : pro.statutValidation === 'VALIDE'
                          ? 'bg-green-200 text-green-900'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {pro.statutValidation.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center whitespace-nowrap">
                    {pro.documentJustificatif ? (
                      <button
                        onClick={() => handleDownloadDocument(pro.documentJustificatif)}
                        className="text-indigo-600 hover:text-indigo-900 transition"
                        title="Télécharger le document"
                      >
                        <FontAwesomeIcon icon={faDownload} size="lg" />
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center whitespace-nowrap">
                    {(pro.statutValidation === 'EN_ATTENTE' || pro.statutValidation === 'REFUSE') ? (
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleValidation(pro.id, true)}
                          className="text-green-600 hover:text-green-900 transition"
                          title="Valider"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        </button>
                        {pro.statutValidation === 'EN_ATTENTE' && (
                          <button
                            onClick={() => handleValidation(pro.id, false)}
                            className="text-red-600 hover:text-red-900 transition"
                            title="Refuser"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">Déjà validé</span>
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
