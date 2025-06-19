import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';
import MesReservations from '../components/utilisateur/MesReservations';
import { getProfil, getConsultationsUtilisateur } from '../services/serviceUtilisateur';

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
          <section className="p-4">
            <MesReservations
              onError={setGlobalError}
              onShowConfirm={handleShowConfirmModal}
            />
          </section>
        );

      case 'consultations':
        return (
          <section className="p-4">
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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
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
          </section>
        );

      case 'humeur':
        return (
          <section className="p-4">
            <SuiviHumeur currentUser={currentUser} />
          </section>
        );

      case 'profil':
        return (
          <section className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
              <User size={28} />
              Mes informations personnelles
            </h2>
            <FormulaireProfil />
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                form="form-profil"
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
      <div className="flex min-h-screen max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Navbar verticale */}
        <nav className="w-64 bg-gradient-to-b from-indigo-700 via-indigo-600 to-indigo-700 text-indigo-50 flex flex-col shadow-lg">
          {/* Photo + Nom utilisateur en haut */}
          <div className="flex items-center gap-4 p-6 border-b border-indigo-500">
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt="Photo utilisateur"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {currentUser.prenom?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg truncate">{currentUser.prenom} {currentUser.nom}</p>
              <p className="text-indigo-200 text-sm truncate">Utilisateur</p>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-grow flex flex-col mt-4 space-y-1 px-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'reservations'
                  ? 'bg-indigo-900 shadow-lg'
                  : 'hover:bg-indigo-800'
              }`}
            >
              <UserCheck size={20} />
              Mes réservations
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'consultations'
                  ? 'bg-indigo-900 shadow-lg'
                  : 'hover:bg-indigo-800'
              }`}
            >
              <CalendarDays size={20} />
              Historique consultations
            </button>
            <button
              onClick={() => setActiveTab('humeur')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'humeur'
                  ? 'bg-indigo-900 shadow-lg'
                  : 'hover:bg-indigo-800'
              }`}
            >
              <Smile size={20} />
              Suivi humeur
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'profil'
                  ? 'bg-indigo-900 shadow-lg'
                  : 'hover:bg-indigo-800'
              }`}
            >
              <User size={20} />
              Mon profil
            </button>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="flex-grow p-6 overflow-auto">
          {/* Messages success / erreur */}
          {successMessage && (
            <div className="mb-6 rounded-md bg-green-100 border border-green-400 text-green-800 px-6 py-4 flex items-center gap-3 shadow">
              <CheckCircle size={20} />
              <p>{successMessage}</p>
            </div>
          )}
          {globalError && (
            <div className="mb-6 rounded-md bg-red-100 border border-red-400 text-red-800 px-6 py-4 flex items-center gap-3 shadow">
              <XCircle size={20} />
              <p>{globalError}</p>
            </div>
          )}

          {renderSection()}
        </main>

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
      </div>
    </Layout>
  );
};

export default TableauUtilisateur;
