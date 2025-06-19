import React from 'react';
import Header from './header'; // Le chemin est maintenant './Header' car il est dans le même dossier 'commun'
import PiedPage from './PiedPage'; // Le chemin est déjà './PiedPage' car il est dans le même dossier 'commun'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <PiedPage />
    </div>
  );
};

export default Layout;