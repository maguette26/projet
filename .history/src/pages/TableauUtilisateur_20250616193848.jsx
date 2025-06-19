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
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getProfil();
        if (user?.id && user.role === 'USER') {
          setCurrentUser(user);
          setGlobalError(null);
        } else {
          setCurrentUser(null);
          setGlobalError("Accès refusé.");
        }
      } catch {
        setGlobalError("Erreur de connexion.");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchConsultations = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const data = await getConsultationsUtilisateur();
      setConsultationsPassees(data);
    } catch {
      setConsultationsError("Erreur lors du chargement.");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.id) fetchConsultations();
  }, [currentUser, fetchConsultations]);

  const formatDateTime = (dateString, timeString = '') => {
    try {
      const dt = new Date(`${dateString}T${timeString}`);
      return dt.toLocaleString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: timeString ? '2-digit' : undefined,
        minute: timeString ? '2-digit' : undefined
      });
    } catch {
      return dateString;
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations':
        return <MesReservations onError={setGlobalError} />;
      case 'consultations':
        return (
          <div className="p-4">
            {consultationsError ? (
              <p className="text-red-500">{consultationsError}</p>
            ) : consultationsPassees.length === 0 ? (
              <p className="text-gray-600">Aucune consultation.</p>
            ) : (
              <table className="min-w-full mt-4 bg-white shadow rounded">
                <thead className="bg-purple-100 text-purple-700 text-left text-sm">
                  <tr>
                    <th className="px-6 py-3">Date & Heure</th>
                    <th className="px-6 py-3">Professionnel</th>
                    <th className="px-6 py-3">Prix</th>
                    <th className="px-6 py-3">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {consultationsPassees.map(con => (
                    <tr key={con.idConsultation} className="hover:bg-purple-50">
                      <td className="px-6 py-4">{formatDateTime(con.dateConsultation, con.heure)}</td>
                      <td className="px-6 py-4">{con.professionnel ? `Dr. ${con.professionnel.prenom} ${con.professionnel.nom}` : 'N/A'}</td>
                      <td className="px-6 py-4">{con.prix} MAD</td>
                      <td className="px-6 py-4">{con.dureeMinutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'humeur':
        return <SuiviHumeur currentUser={currentUser} />;
      case 'profil':
        return (
          <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
              <User size={24} /> Mes infos personnelles
            </h2>
            <FormulaireProfil />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <Layout><div className="text-center p-8 text-purple-600">Chargement...</div></Layout>;
  if (globalError && !currentUser) return <Layout><div className="p-6 text-red-600">{globalError}</div></Layout>;

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar responsive with hover shrink */}
        <nav
          className="group transition-all duration-300 ease-in-out bg-gradient-to-b from-purple-700 via-purple-600 to-purple-700 text-white w-64 hover:w-20 flex flex-col items-stretch shadow-lg"
        >
          <div className="flex items-center gap-4 p-4 border-b border-purple-500 transition-all">
            {currentUser?.photoUrl ? (
              <img src={currentUser.photoUrl} alt="user" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                {currentUser?.prenom?.[0] || 'U'}
              </div>
            )}
            <div className="group-hover:hidden">
              <p className="font-semibold">{currentUser?.prenom}</p>
              <p className="text-sm text-purple-200">Utilisateur</p>
            </div>
          </div>

          <div className="flex-grow space-y-1 mt-4 px-2">
            <NavItem icon={<UserCheck size={20} />} label="Réservations" active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} />
            <NavItem icon={<CalendarDays size={20} />} label="Consultations" active={activeTab === 'consultations'} onClick={() => setActiveTab('consultations')} />
            <NavItem icon={<Smile size={20} />} label="Humeur" active={activeTab === 'humeur'} onClick={() => setActiveTab('humeur')} />
            <NavItem icon={<User size={20} />} label="Profil" active={activeTab === 'profil'} onClick={() => setActiveTab('profil')} />
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-grow p-6">
          {globalError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded flex items-center gap-2 mb-4">
              <XCircle size={20} />
              <span>{globalError}</span>
            </div>
          )}
          {renderSection()}
        </main>
      </div>
    </Layout>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
      ${active ? 'bg-purple-900' : 'hover:bg-purple-800'} group-hover:justify-center`}
  >
    {icon}
    <span className="group-hover:hidden">{label}</span>
  </button>
);

export default TableauUtilisateur;
