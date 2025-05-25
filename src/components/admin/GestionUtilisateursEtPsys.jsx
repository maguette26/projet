import React, { useEffect, useState } from 'react';
// Importez les fonctions du service admin. Ajustez le chemin si nécessaire.
import { getAllUsers, getUserById, updateUser, deleteUser } from '../../services/serviceAdmin';


const GestionUtilisateursEtPsys = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Rôles disponibles pour la modification. Assurez-vous qu'ils correspondent à vos enums Java.
    const rolesDisponibles = ['USER', 'PSYCHIATRE', 'PSYCHOLOGUE', 'ADMIN'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err.response?.data || err.message);
            setError("Impossible de charger les utilisateurs. " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            // 1. Récupérer l'utilisateur actuel pour obtenir toutes ses propriétés
            const userToUpdate = await getUserById(userId);

            // 2. Mettre à jour la propriété 'role' de l'objet utilisateur
            userToUpdate.role = newRole; // Assurez-vous que la propriété de rôle est bien 'role' dans votre entité Utilisateur

            // 3. Envoyer l'objet utilisateur complet avec le rôle mis à jour au backend
            await updateUser(userId, userToUpdate);

            alert(`Rôle de l'utilisateur ${userToUpdate.prenom || ''} ${userToUpdate.nom || ''} mis à jour en ${newRole} !`);
            fetchUsers(); // Re-charger les utilisateurs pour voir la mise à jour
        } catch (err) {
            console.error("Erreur lors de la mise à jour du rôle:", err.response?.data || err.message);
            alert("Erreur lors de la mise à jour du rôle : " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
            try {
                await deleteUser(userId);
                alert(`Utilisateur ${userName} supprimé avec succès.`);
                fetchUsers();
            } catch (err) {
                console.error("Erreur lors de la suppression de l'utilisateur:", err.response?.data || err.message);
                alert("Erreur lors de la suppression de l'utilisateur : " + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Chargement des utilisateurs...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="overflow-x-auto"> {/* Permet le défilement horizontal si le tableau est trop large */}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.nom}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.prenom}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
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
                                <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteUser(user.id, `${user.prenom || ''} ${user.nom || ''}`)}
                                        className="text-red-600 hover:text-red-900 ml-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GestionUtilisateursEtPsys;