import React, { useState, useEffect } from 'react';
import Layout from '../components/commun/Layout';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';
import MesReservations from '../components/utilisateur/MesReservations';
import { getProfil, getConsultationsUtilisateur } from '../services/serviceUtilisateur';
import {
  CalendarDays,
  UserCheck,
  Smile,
  User,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import clsx from 'clsx';

// Tooltip simple avec CSS
const Tooltip = ({ children, label, show }) => (
  <div className="relative flex items-center group">
    {children}
    {show && (
      <span className="absolute left-full ml-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    )}
  </div>
);

const TableauUtilisateur = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [consultationsPassees, setConsultationsPassees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [activeTab, setActiveTab] = useState('reservations');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setTheme(storedTheme || 'light');
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getProfil();
        if (user && user.id && user.role === 'USER') {
          setCurrentUser(user);
        } else {
          setGlobalError("Accès refusé : Vous n'êtes pas un utilisateur ou non connecté.");
        }
      } catch {
        setGlobalError("Erreur de connexion. Veuillez vous reconnecter.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      getConsultationsUtilisateur()
        .then(data => setConsultationsPassees(data))
        .catch(() => setGlobalError("Impossible de charger vos consultations passées."));
    }
  }, [currentUser]);

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations': return <MesReservations />;
      case 'consultations': return <div className="p-4">Historique</div>;
      case 'humeur': return <SuiviHumeur currentUser={currentUser} />;
      case 'profil': return <FormulaireProfil />;
      default: return null;
    }
  };

  if (loading) return <Layout>Chargement...</Layout>;

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <aside
          className={clsx(
            "bg-blue-700 text-white shadow-xl h-screen transition-[width] duration-300 ease-in-out overflow-hidden flex flex-col justify-between",
            isSidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div>
            {/* Haut - Photo + Nom/Prénom */}
            <div className="flex items-center gap-3 p-5 border-b border-blue-600">
              {currentUser?.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg">
                  {currentUser?.prenom?.charAt(0)}
                </div>
              )}
              {!isSidebarCollapsed && (
                <div>
                  <p className="font-semibold">{currentUser?.prenom}</p>
                  <p className="text-sm text-blue-200">{currentUser?.nom}</p>
                </div>
              )}
            </div>

            {/* Menu */}
            <nav className="mt-4 space-y-1">
              <SidebarButton
                icon={<UserCheck size={20} className="transition-transform group-hover:scale-110" />}
                label="Réservations"
                active={activeTab === 'reservations'}
                onClick={() => handleTabChange('reservations')}
                collapsed={isSidebarCollapsed}
              />
              <SidebarButton
                icon={<CalendarDays size={20} className="transition-transform group-hover:scale-110" />}
                label="Consultations"
                active={activeTab === 'consultations'}
                onClick={() => handleTabChange('consultations')}
                collapsed={isSidebarCollapsed}
              />
              <SidebarButton
                icon={<Smile size={20} className="transition-transform group-hover:scale-110" />}
                label="Humeur"
                active={activeTab === 'humeur'}
                onClick={() => handleTabChange('humeur')}
                collapsed={isSidebarCollapsed}
              />
              <SidebarButton
                icon={<User size={20} className="transition-transform group-hover:scale-110" />}
                label="Profil"
                active={activeTab === 'profil'}
                onClick={() => handleTabChange('profil')}
                collapsed={isSidebarCollapsed}
              />
            </nav>
          </div>

          {/* Bas - Boutons Thème + Réduction */}
          <div className="mb-4 px-4 space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-800 rounded-md justify-center"
              title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {!isSidebarCollapsed && (theme === 'light' ? 'Mode sombre' : 'Mode clair')}
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-800 hover:bg-blue-900 rounded-md justify-center"
              title={isSidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
            >
              <Menu size={18} />
              {!isSidebarCollapsed && "Réduire"}
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 dark:text-white">{renderSection()}</main>
      </div>
    </Layout>
  );
};

const SidebarButton = ({ icon, label, active, onClick, collapsed }) => (
  <Tooltip label={label} show={collapsed}>
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-blue-800 transition-colors rounded-md',
        active ? 'bg-blue-800' : '',
        collapsed ? 'justify-center' : ''
      )}
    >
      {icon}
      {!collapsed && label}
    </button>
  </Tooltip>
);

export default TableauUtilisateur;
