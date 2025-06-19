// ... (imports identiques)
import { motion } from 'framer-motion'; // Optionnel si tu veux des animations plus poussées

const TableauUtilisateur = () => {
  // ... (tous les states inchangés)

  // Rendu
  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <aside
          className={clsx(
            "bg-blue-700 text-white shadow-xl h-screen transition-[width] duration-300 ease-in-out overflow-hidden",
            isSidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className="flex flex-col h-full justify-between">
            {/* Haut - User Info */}
            <div>
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
                  icon={<UserCheck size={20} />}
                  label="Réservations"
                  active={activeTab === 'reservations'}
                  onClick={() => handleTabChange('reservations')}
                  collapsed={isSidebarCollapsed}
                />
                <SidebarButton
                  icon={<CalendarDays size={20} />}
                  label="Consultations"
                  active={activeTab === 'consultations'}
                  onClick={() => handleTabChange('consultations')}
                  collapsed={isSidebarCollapsed}
                />
                <SidebarButton
                  icon={<Smile size={20} />}
                  label="Humeur"
                  active={activeTab === 'humeur'}
                  onClick={() => handleTabChange('humeur')}
                  collapsed={isSidebarCollapsed}
                />
                <SidebarButton
                  icon={<User size={20} />}
                  label="Profil"
                  active={activeTab === 'profil'}
                  onClick={() => handleTabChange('profil')}
                  collapsed={isSidebarCollapsed}
                />
              </nav>
            </div>

            {/* Bas - Thème & Réduction */}
            <div className="mb-4 px-4 space-y-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-800 rounded-md justify-center"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {!isSidebarCollapsed && (theme === 'light' ? 'Mode sombre' : 'Mode clair')}
              </button>

              {/* Réduire bouton */}
              <button
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-800 hover:bg-blue-900 rounded-md justify-center"
              >
                <Menu size={18} />
                {!isSidebarCollapsed && "Réduire"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 dark:text-white">{renderSection()}</main>
      </div>
    </Layout>
  );
};
