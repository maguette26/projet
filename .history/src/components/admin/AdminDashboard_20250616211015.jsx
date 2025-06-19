// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (userRole === 'ADMIN') {
      setIsAdmin(true);
    } else {
      // Redirection selon rôle
      switch (userRole) {
        case 'UTILISATEUR':
          navigate('/tableauUtilisateur');
          break;
        case 'PSYCHIATRE':
        case 'PSYCHOLOGUE':
          navigate('/tableauProfessionnel');
          break;
        default:
          navigate('/');
          break;
      }
      alert("Accès refusé. Vous n'avez pas les permissions d'administrateur.");
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-grow flex items-center justify-center py-8 text-gray-700">
          Chargement du tableau de bord administrateur...
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null; // Redirection faite dans useEffect
  }

  return (
    <AdminLayout>
      <div className="flex-grow py-8 px-6 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          Bienvenue, Administrateur !
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          C'est votre espace de gestion centralisée. Utilisez la barre de navigation en haut pour accéder aux différentes sections administratives.
        </p>
        {/* Ici tu peux rajouter les widgets ou éléments admin comme dans dashboard utilisateur */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
