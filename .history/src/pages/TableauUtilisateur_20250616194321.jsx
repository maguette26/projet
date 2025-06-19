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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (successMessage || globalError) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setGlobalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, globalError]);

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
      let dateTime = timeString ? new Date(`${dateString}T${timeString}`) : new Date(dateString);
      return dateTime.toLocaleString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: timeString ? '2-digit' : undefined,
        minute: timeString ? '2-digit' : undefined
      });
    } catch {
      return `${dateString}${timeString ? ' ' + timeString : ''}`;
    }
  };

  if (loading) return <Layout><div className="text-center py-8 text-indigo-600 font-semibold">Chargement du tableau de bord...</div></Layout>;

  if (globalError && !currentUser) return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-xl mx-auto mt-10">{globalError}</div></Layout>;

  if (!currentUser || currentUser.role !== 'USER') return <Layout><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-xl mx-auto mt-10">Vous n'avez pas les autorisations nécessaires pour accéder à ce tableau de bord.</div></Layout>;

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations': return <section className="p-4"><MesReservations onError={setGlobalError} onShowConfirm={() => {}} /></section>;
      case 'consultations': return (
        <section className="p-4">
          {consultationsError ? <p className="text-red-500 font-semibold">{consultationsError}</p> :
            consultationsPassees.length === 0 ? <p className="text-gray-600">Vous n'avez pas d'historique de consultations pour le moment.</p> : (
              <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Date & Heure</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Professionnel</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Prix</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Durée (min)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {consultationsPassees.map(con => (
                      <tr key={con.idConsultation} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDateTime(con.dateConsultation, con.heure)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{con.professionnel ? `Dr. ${con.professionnel.prenom} ${con.professionnel.nom}` : 'N/A'}</td>
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
      case 'humeur': return <section className="p-4"><SuiviHumeur currentUser={currentUser} /></section>;
      case 'profil': return (
        <section className="p-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
            <User size={28} />
            Mes informations personnelles
          </h2>
          <FormulaireProfil />
        </section>
      );
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen max-w-7xl mx-auto bg-gray-50">
        <nav className={`bg-white border-r border-gray-200 shadow-md transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-56' : 'w-20'} items-center md:items-stretch`}>
          <div className={`flex items-center gap-3 p-4 border-b border-gray-100 ${sidebarOpen ? '' : 'justify-center'}`}>
            {currentUser.photoUrl ? (
              <img src={currentUser.photoUrl} alt="Photo utilisateur" className="w-12 h-12 rounded-full object-cover border border-gray-300" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {currentUser.prenom?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {sidebarOpen && (
              <div>
                <p className="font-semibold text-gray-800">{currentUser.prenom} {currentUser.nom}</p>
                <p className="text-sm text-gray-500">Utilisateur</p>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4 space-y-1 w-full px-2">
            {[{ id: 'reservations', label: 'Réservations', icon: <UserCheck size={20} /> },
              { id: 'consultations', label: 'Consultations', icon: <CalendarDays size={20} /> },
              { id: 'humeur', label: 'Humeur', icon: <Smile size={20} /> },
              { id: 'profil', label: 'Profil', icon: <User size={20} /> }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition duration-200 hover:bg-indigo-100 ${
                  activeTab === tab.id ? 'bg-indigo-200 text-indigo-900 font-semibold' : 'text-gray-700'
                }`}
                title={tab.label}
              >
                {tab.icon}
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            ))}
          </div>

          <div className="mt-auto p-4">
            <button onClick={() => setSidebarOpen(prev => !prev)} className="w-full flex justify-center text-gray-500 hover:text-indigo-600 transition" title={sidebarOpen ? 'Réduire' : 'Agrandir'}>
              {sidebarOpen ? '«' : '»'}
            </button>
          </div>
        </nav>

        <main className={`flex-grow transition-all duration-300 p-6 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
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
      </div>
    </Layout>
  );
};

export default TableauUtilisateur;
