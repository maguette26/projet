import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const rolesDisponibles = ['USER', 'ADMIN', 'PSYCHOLOGUE', 'PSYCHIATRE', 'PREMIUM'];
  const [currentAdminEmail, setCurrentAdminEmail] = useState(null);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentAdminEmail(res.data.email);
      setCurrentAdminRole(res.data.role);
      if (res.data.role === 'ADMIN') {
        fetchUsers();
      } else {
        setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des informations utilisateur. Veuillez vous reconnecter.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/connexion';
    } catch (err) {
      setError("Erreur lors de la déconnexion.");
    }
  };

  const fetchUsers = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await getAllUsers();
      const filteredUsers = data.filter(user => user.role === 'USER');
      setUsers(filteredUsers);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Accès refusé.");
      } else {
        setError("Impossible de charger les utilisateurs.");
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const roleUpdatePayload = { id: userId, role: newRole };
      await updateUser(userId, roleUpdatePayload);
      const updatedUser = users.find(u => u.id === userId);
      setSuccessMessage(`Rôle de ${updatedUser?.prenom || ''} ${updatedUser?.nom || ''} mis à jour en ${newRole}`);
      fetchUsers();
    } catch (err) {
      setError("Erreur lors de la mise à jour du rôle.");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await deleteUser(userId);
      setSuccessMessage(`Utilisateur ${userName} supprimé avec succès.`);
      fetchUsers();
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  if (currentAdminRole && currentAdminRole !== "ADMIN") {
    return (
      <div className="max-w-xl mx-auto mt-16 p-6 bg-red-100 text-red-800 rounded-md shadow-md text-center font-semibold">
        Vous n'avez pas la permission d'accéder à cette page.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Gestion des Utilisateurs</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-sm" role="alert">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-sm" role="alert">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-indigo-600">
            <tr>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">ID</th>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">Nom</th>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">Prénom</th>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">Email</th>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">Téléphone</th>
              <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wide text-white">Rôle</th>
              <th className="py-3 px-5 text-center text-xs font-semibold uppercase tracking-wide text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-5 text-sm text-gray-700 font-medium">{user.id}</td>
                  <td className="py-4 px-5 text-sm text-gray-900">{user.nom}</td>
                  <td className="py-4 px-5 text-sm text-gray-900">{user.prenom}</td>
                  <td className="py-4 px-5 text-sm text-gray-900">{user.email}</td>
                  <td className="py-4 px-5 text-sm text-gray-900">{user.telephone || 'N/A'}</td>
                  <td className="py-4 px-5 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {rolesDisponibles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      whileTap={{ scale: 0.9, rotate: 10 }}
                      onClick={() => handleDeleteUser(user.id, `${user.prenom || ''} ${user.nom || ''}`)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition duration-200"
                      title={`Supprimer ${user.prenom || ''} ${user.nom || ''}`}
                      aria-label={`Supprimer ${user.prenom || ''} ${user.nom || ''}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUtilisateurs;
