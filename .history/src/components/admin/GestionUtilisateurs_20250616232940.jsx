import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { Trash2 } from 'lucide-react';

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const rolesDisponibles = ['USER', 'ADMIN', 'PSYCHOLOGUE', 'PSYCHIATRE'];
  const [currentAdminRole, setCurrentAdminRole] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentAdminRole(res.data.role);
      if (res.data.role === 'ADMIN') {
        fetchUsers();
      } else {
        setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erreur lors de la récupération des informations utilisateur.");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      const filteredUsers = data.filter(user => user.role === 'USER');
      setUsers(filteredUsers);
    } catch (err) {
      setError("Erreur lors de la récupération des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { id: userId, role: newRole });
      setSuccessMessage("Rôle mis à jour avec succès.");
      fetchUsers();
    } catch {
      setError("Erreur lors de la mise à jour du rôle.");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Supprimer ${userName} ?`)) return;
    try {
      await deleteUser(userId);
      setSuccessMessage("Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Chargement...</div>;
  }

  if (currentAdminRole !== 'ADMIN') {
    return <div className="text-center text-red-500 mt-6">Accès refusé.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-800">Gestion des utilisateurs</h1>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Rôle', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.nom}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.prenom}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.telephone || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-white border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {rolesDisponibles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id, `${user.prenom || ''} ${user.nom || ''}`)}
                      className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
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
