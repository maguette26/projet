import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/serviceAdmin';
import api from '../../services/api';
import { logout } from '../../services/serviceAuth';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GestionUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const rolesDisponibles = ['USER', 'ADMIN', 'PSYCHOLOGUE', 'PSYCHIATRE',''];
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
                setLoading(false);
            }
        } catch (err) {
            setError("Erreur lors de la récupération des informations utilisateur. Veuillez vous reconnecter.");
            setLoading(false);
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
        setLoading(true);
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
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success mt-3">
                    {successMessage}
                </div>
            )}

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm">{user.id}</td>
                                    <td className="py-3 px-4 text-sm">{user.nom}</td>
                                    <td className="py-3 px-4 text-sm">{user.prenom}</td>
                                    <td className="py-3 px-4 text-sm">{user.email}</td>
                                    <td className="py-3 px-4 text-sm">{user.telephone || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="block w-full py-1 px-2 border border-gray-300 rounded-md text-sm"
                                        >
                                            {rolesDisponibles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-center">
                                        <motion.button
                                            whileHover={{ scale: 1.2, rotate: -10 }}
                                            whileTap={{ scale: 0.9, rotate: 10 }}
                                            onClick={() => handleDeleteUser(user.id, `${user.prenom || ''} ${user.nom || ''}`)}
                                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition duration-200"
                                            title={`Supprimer ${user.prenom || ''} ${user.nom || ''}`}
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
