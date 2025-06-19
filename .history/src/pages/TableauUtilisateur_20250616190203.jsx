// src/pages/Utilisateur/TableauUtilisateur.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';
import MesReservations from '../components/utilisateur/MesReservations';
import { getProfil, getConsultationsUtilisateur } from '../services/serviceUtilisateur';

// Import des icônes Lucide
import { CalendarDays, UserCheck, Smile, User, XCircle, CheckCircle } from 'lucide-react';

const TableauUtilisateur = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [consultationsPassees, setConsultationsPassees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [consultationsError, setConsultationsError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('reservations');

  // Modal confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(null);

  // Modal info
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState('');

  useEffect(() => {
    if (successMessage || globalError) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setGlobalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, globalError]);

  const handleShowConfirmModal = useCallback((message, action) => {
    setConfirmModalTitle('Confirmation');
    setConfirmModalMessage(message);
    setConfirmModalAction(() => () => {
      action();
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  }, []);

  const handleShowInfoModal = useCallback((title, content) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setShowInfoModal(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getProfil();
        if (user && user.id && user.role === 'USER') {
          setCurrentUser(user);
          setGlobalError(null);
        } else {
          setCurrentUser(null);
          setGlobalError("Accès refusé : Vous n'êtes pas un utilisateur ou non connecté.");
        }
      } catch (err) {
        console.error(err);
        setCurrentUser(null);
        setGlobalError("Erreur de connexion. Veuillez vous reconnecter.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchConsultations = useCallback(async () => {
    if (!currentUser || !currentUser.id) {
      setConsultationsPassees([]);
      setConsultationsError(null);
      return;
    }
    setConsultationsError(null);
    try {
      const data = await getConsultationsUtilisateur();
      setConsultationsPassees(data);
    } catch (err) {
      console.error(err);
      setConsultationsError("Impossible de charger vos consultations passées.");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchConsultations();
    }
  }, [currentUser, fetchConsultations]);

  const formatDateTime = (dateString, timeString = '') => {
    if (!dateString) return 'N/A';
    try {
      let dateTime;
      if (timeString) {
        dateTime = new Date(`${dateString}T${timeString}`);
      } else {
        dateTime = new Date(dateString);
      }
      if (isNaN(dateTime.getTime())) {
        return `${dateString}${timeString ? ' ' + timeString : ''}`;
      }
      return dateTime.toLocaleString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: timeString ? '2-digit' : undefined,
        minute: timeString ? '2-digit' : undefined
      });
    } catch {
      return `${dateString}${timeString ? ' ' + timeString : ''}`;
    }
  };

  if (loading) {
    return <Layout><div className="text-center py-8 text-indigo-600 font-semibold">Chargement du tableau de bord...</div></Layout>;
  }

  if (globalError && !currentUser) {
    return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-xl mx-auto mt-10">{globalError}</div></Layout>;
  }

  if (!currentUser || currentUser.role !== 'USER') {
    return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-xl mx-auto mt-10">Vous n'avez pas les autorisations nécessaires pour accéder à ce tableau de bord.</div></Layout>;
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations':
        return (
          <section>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <MesReservations
                onError={setGlobalError}
                onShowConfirm={handleShowConfirmModal}
                onShowInfo={handleShowInfoModal}
              />
            </div>
          </section>
        );

      case 'consultations':
        return (
          <section>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {consultationsError ? (
                <p className="text-red-500 font-semibold">{consultationsError}</p>
              ) : consultationsPassees.length === 0 ? (
                <p className="text-gray-600">Vous n'avez pas d'historique de consultations pour le moment.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                          <CalendarDays size={16} />
                          Date & Heure
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                          <UserCheck size={16} />
                          Professionnel
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                          Durée (min)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {consultationsPassees.map(con => (
                        <tr key={con.idConsultation} className="hover:bg-indigo-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {formatDateTime(con.dateConsultation, con.heure)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {con.professionnel ? `Dr. ${con.professionnel.prenom} ${con.professionnel.nom}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">{con.prix} MAD</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{con.dureeMinutes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        );

      case 'humeur':
        return (
          <section>
            <SuiviHumeur currentUser={currentUser} />
          </section>
        );

      case 'profil':
        return (
          <section className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700 flex items-center justify-center gap-3">
              <User size={28} />
              Mes informations personnelles
            </h2>
            {/* Photo utilisateur */}
            <div className="flex justify-center mb-6">
              {currentUser.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt="Photo Utilisateur"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-600 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 text-5xl font-bold shadow-md">
                  {currentUser.prenom?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <FormulaireProfil />
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                form="form-profil" // Assure-toi que ton FormulaireProfil a cet id
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold transition"
              >
                Enregistrer
              </button>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 md:mb-0">
            Bonjour, {currentUser.prenom}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-5 py-2 rounded-md font-semibold transition ${
                activeTab === 'reservations'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              title="Mes réservations"
            >
              <UserCheck className="inline-block mr-2 -mb-1" size={18} />
              Réservations
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-5 py-2 rounded-md font-semibold transition ${
                activeTab === 'consultations'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              title="Historique consultations"
            >
              <CalendarDays className="inline-block mr-2 -mb-1" size={18} />
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('humeur')}
              className={`px-5 py-2 rounded-md font-semibold transition ${
                activeTab === 'humeur'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              title="Suivi humeur"
            >
              <Smile className="inline-block mr-2 -mb-1" size={18} />
              Suivi humeur
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className={`px-5 py-2 rounded-md font-semibold transition ${
                activeTab === 'profil'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
              title="Mon profil"
            >
              <User className="inline-block mr-2 -mb-1" size={18} />
              Profil
            </button>
          </div>
        </header>

        {/* Messages success / erreur */}
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-100 border border-green-400 text-green-800 px-6 py-4 flex items-center gap-3">
            <CheckCircle size={20} />
            <p>{successMessage}</p>
          </div>
        )}
        {globalError && (
          <div className="mb-6 rounded-md bg-red-100 border border-red-400 text-red-800 px-6 py-4 flex items-center gap-3">
            <XCircle size={20} />
            <p>{globalError}</p>
          </div>
        )}

        {renderSection()}

        {/* Modal confirmation */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">{confirmModalTitle}</h3>
              <p className="mb-6">{confirmModalMessage}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmModalAction}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal info */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">{infoModalTitle}</h3>
              <div className="mb-6 whitespace-pre-wrap text-gray-800">{infoModalContent}</div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TableauUtilisateur;
