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

const TableauUtilisateur = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [activeTab, setActiveTab] = useState('reservations');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  // Charge le thème depuis localStorage au montage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        setTheme('light');
      }
    } catch (e) {
      console.error('Erreur accès localStorage', e);
    }
  }, []);

  // Fonction toggle thème sécurisée
  const toggleTheme = () => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setTheme('light');
      }
    } catch (e) {
      console.error('Erreur toggle theme', e);
    }
  };

  // Fonction toggle sidebar
  const toggleSidebar = () => {
    try {
      setIsSidebarCollapsed(prev => !prev);
    } catch (e) {
      console.error('Erreur toggle sidebar', e);
    }
  };

  // Récupération user simplifiée
  useEffect(() => {
    (async () => {
      try {
        const user = await getProfil();
        if (user && user.id && user.role === 'USER') {
          setCurrentUser(user);
        } else {
          setGlobalError("Accès refusé.");
        }
      } catch {
        setGlobalError("Erreur de connexion.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Layout>Chargement...</Layout>;
  if (globalError) return <Layout><p className="text-red-500">{globalError}</p></Layout>;

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <aside className={clsx(
          "bg-blue-700 text-white shadow-xl h-screen transition-[width] duration-300 ease-in-out overflow-hidden flex flex-col justify-between",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}>
          <div>
            <div className="flex items-center gap-3 p-5 border-b border-blue-600">
              {currentUser?.photoUrl ? (
                <img src={currentUser.photoUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
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

            <nav className="mt-4 space-y-1">
              <SidebarButton icon={<UserCheck size={20} />} label="Réservations" active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} collapsed={isSidebarCollapsed} />
              <SidebarButton icon={<CalendarDays size={20} />} label="Consultations" active={activeTab === 'consultations'} onClick={() => setActiveTab('consultations')} collapsed={isSidebarCollapsed} />
              <SidebarButton icon={<Smile size={20} />} label="Humeur" active={activeTab === 'humeur'} onClick={() => setActiveTab('humeur')} collapsed={isSidebarCollapsed} />
              <SidebarButton icon={<User size={20} />} label="Profil" active={activeTab === 'profil'} onClick={() => setActiveTab('profil')} collapsed={isSidebarCollapsed} />
            </nav>
          </div>

          <div className="mb-4 px-4 space-y-3">
            <button onClick={toggleTheme} className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-800 rounded-md justify-center" title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {!isSidebarCollapsed && (theme === 'light' ? 'Mode sombre' : 'Mode clair')}
            </button>
            <button onClick={toggleSidebar} className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-800 hover:bg-blue-900 rounded-md justify-center" title={isSidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}>
              <Menu size={18} />
              {!isSidebarCollapsed && "Réduire"}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 dark:text-white">
          {activeTab === 'reservations' && <MesReservations />}
          {activeTab === 'consultations' && <div className="p-4">Historique</div>}
          {activeTab === 'humeur' && <SuiviHumeur currentUser={currentUser} />}
          {activeTab === 'profil' && <FormulaireProfil />}
        </main>
      </div>
    </Layout>
  );
};

const SidebarButton = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={clsx(
      'flex items-center gap-3 px-4 py-3 text-sm font-medium w-full hover:bg-blue-800 transition-colors rounded-md',
      active ? 'bg-blue-800' : '',
      collapsed ? 'justify-center' : ''
    )}
    title={collapsed ? label : undefined}
  >
    {icon}
    {!collapsed && label}
  </button>
);

export default TableauUtilisateur;
