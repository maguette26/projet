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
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const GestionProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('TOUS'); // TOUS, EN_ATTENTE, VALIDE, REFUSE
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

      {/* Tableau */}
      {filteredProfessionnels.length === 0 ? (
        <p className="text-center text-gray-600">Aucun professionnel correspondant.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Document
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessionnels.map(pro => (
                <tr key={pro.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {pro.nom} {pro.prenom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pro.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pro.telephone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{pro.specialite || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        pro.statutValidation === 'EN_ATTENTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pro.statutValidation === 'VALIDE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pro.statutValidation.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    {pro.documentJustificatif ? (
                      <button
                        onClick={() => handleDownloadDocument(pro.documentJustificatif)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Télécharger"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    {(pro.statutValidation === 'EN_ATTENTE' || pro.statutValidation === 'REFUSE') ? (
                      <>
                        <button
                          onClick={() => handleValidation(pro.id, true)}
                          className="text-green-600 hover:text-green-900 mx-2"
                          title="Valider"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        </button>
                        {pro.statutValidation === 'EN_ATTENTE' && (
                          <button
                            onClick={() => handleValidation(pro.id, false)}
                            className="text-red-600 hover:text-red-900 mx-2"
                            title="Refuser"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                          </button>
                        )}
                      </>
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
