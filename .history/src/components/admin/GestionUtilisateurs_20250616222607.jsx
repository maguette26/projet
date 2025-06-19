import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const GestionUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const rolesDisponibles = ['USER', 'ADMIN','PSYCHOLOGUE','PSYCHIATR']; // Seuls les rôles pertinents pour cette vue

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
                fetchUsers(); // Récupère tous les utilisateurs et les filtre ensuite
            } else {
                setError("Accès refusé : Vous n'avez pas la permission d'accéder à cette page.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des infos utilisateur:", err.response?.data || err.message);
            setError("Erreur lors de la récupération des informations utilisateur. Veuillez vous reconnecter.");
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Redirige l'utilisateur vers la page de connexion après déconnexion réussie
            window.location.href = '/connexion';
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            setError("Erreur lors de la déconnexion.");
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await getAllUsers();
            // Filtrer les utilisateurs pour n'afficher que ceux avec le rôle 'USER'
            const filteredUsers = data.filter(user => user.role === 'USER');
            setUsers(filteredUsers);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err.response?.data || err.message);
            if (err.response?.status === 403) {
                setError("Accès refusé : Vous n'avez pas les permissions nécessaires pour voir les utilisateurs.");
            } else if (err.response?.status === 401) {
                setError("Session expirée ou non autorisée. Veuillez vous reconnecter.");
            } else {
                setError("Impossible de charger les utilisateurs. " + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setError(null);
        setSuccessMessage(null);
        try {
            const roleUpdatePayload = { id: userId, role: newRole };
            await updateUser(userId, roleUpdatePayload);
            const updatedUserInState = users.find(u => u.id === userId);
            setSuccessMessage(`Rôle de l'utilisateur ${updatedUserInState?.prenom || ''} ${updatedUserInState?.nom || ''} mis à jour en ${newRole} !`);
            fetchUsers(); // Recharger la liste pour refléter le changement
        } catch (err) {
            console.error("Erreur lors de la mise à jour du rôle:", err.response?.data || err.message);
            setError("Erreur lors de la mise à jour du rôle : " + (err.response?.data?.message || err.message || ""));
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
            return;
        }
        setError(null);
        setSuccessMessage(null);
        try {
            await deleteUser(userId);
            setSuccessMessage(`Utilisateur ${userName} supprimé avec succès.`);
            fetchUsers();
        } catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur:", err.response?.data || err.message);
            setError("Erreur lors de la suppression de l'utilisateur : " + (err.response?.data?.message || err.message || ""));
        }
    };

    if (currentAdminRole && currentAdminRole !== "ADMIN") {
        return (
            <div className="alert alert-danger mt-5 text-center">
                Vous n'avez pas la permission d'accéder à cette page.
            </div>
        );
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Chargement des utilisateurs...</div>;
    }

    if (error && error.includes("Accès refusé")) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mt-5">
            
          

            {error && (
                <div className="alert alert-danger alert-dismissible fade show mt-3">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mt-3">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                </div>
            )}

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                                    Aucun utilisateur standard trouvé.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.nom}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.prenom}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.telephone || 'N/A'}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            {rolesDisponibles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, `${user.prenom || ''} ${user.nom || ''}`)}
                                            className="text-red-600 hover:text-red-900 ml-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            aria-label={`Supprimer ${user.prenom || ''} ${user.nom || ''}`}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Supprimer
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