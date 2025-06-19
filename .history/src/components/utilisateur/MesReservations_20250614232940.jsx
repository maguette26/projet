// src/components/utilisateur/MesReservations.jsx
import React, { useState, useEffect, useCallback } from 'react';
// Importations corrigées pour correspondre à serviceUtilisateur.js
import { getReservationsUtilisateur } from '../../services/serviceUtilisateur';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Ajout de faCheckCircle et correction de faTimesCircle si nécessaire pour le statut ANNULEE/REFUSE
import { faCalendarAlt, faTimesCircle, faClock, faVideo, faCalendarCheck, faInfoCircle, faDollarSign, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Le composant MesReservations prendra des props pour interagir avec les modales du parent
const MesReservations = ({ onError, onShowConfirm, onShowInfo }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMesReservations = useCallback(async () => {
        setLoading(true);
        try {
            // Utilise la fonction renommée du service
            const data = await getReservationsUtilisateur();
            setReservations(data);
        } catch (err) {
            console.error("Erreur lors de la récupération des réservations de l'utilisateur:", err);
            // Passe l'erreur au parent via la prop onError
            onError("Impossible de charger vos réservations. Veuillez vous reconnecter.");
        } finally {
            setLoading(false);
        }
    }, [onError]); // Dépend de onError, car c'est une fonction passée en prop

    useEffect(() => {
        fetchMesReservations();
    }, [fetchMesReservations]);

    const handleAnnulerReservation = (reservationId) => {
        // Utilise la prop onShowConfirm fournie par le parent pour afficher la modale de confirmation
        onShowConfirm(
            "Êtes-vous sûr de vouloir annuler cette réservation ?",
            async () => {
                try {
                    // Utilise la fonction renommée du service
                    await cancelReservation(reservationId);
                    // Recharge la liste après annulation réussie
                    fetchMesReservations(); 
                    // Informe le parent d'un changement, si nécessaire (ex: pour mettre à jour un message de succès global)
                    // onReservationChange(); // Cette prop n'est plus nécessaire ici car on utilise onError/onShowConfirm du parent
                } catch (err) {
                    console.error("Erreur lors de l'annulation de la réservation :", err.response ? err.response.data : err.message);
                    // Passe l'erreur au parent
                    onError(`Erreur lors de l'annulation : ${err.response?.data?.message || err.message}`);
                }
            }
        );
    };

    // Fonction de formatage de date/heure, corrigée pour utiliser heureReservation
    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        try {
            // Assure un format ISO pour la création de Date, même si l'heure est optionnelle
            const dateTime = new Date(`${dateString}T${timeString || '00:00'}:00`);
            
            if (isNaN(dateTime.getTime())) { // Vérifie si la date est invalide
                console.warn("Invalid date format detected for:", dateString, timeString);
                return `${dateString}${timeString ? ' ' + timeString : ''}`; 
            }

            return dateTime.toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Erreur de formatage de date/heure:", e);
            return `${dateString} ${timeString || ''}`; // Retourne les strings bruts en cas d'erreur
        }
    };

    // Fonction pour afficher les détails dans une modale d'information
    const showReservationDetails = (res) => {
        const details = `
            Détails de la réservation ${res.id}:
            Professionnel: ${res.professionnel?.nom} ${res.professionnel?.prenom}
            Date Demande: ${formatDateTime(res.dateReservation, res.heureReservation)}
            Statut: ${res.statut}
            Prix: ${res.prix ? `${res.prix.toFixed(2)} MAD` : 'N/A'}
            Consultation: ${res.consultation ? `Date: ${formatDateTime(res.consultation.dateConsultation, res.consultation.heure)}, Prix: ${res.consultation.prix || 'N/A'} MAD` : 'Non créée'}
        `;
        // Utilise la prop onShowInfo fournie par le parent
        onShowInfo("Détails de la réservation", details);
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Chargement de vos réservations...</div>;
    }

    if (!reservations || reservations.length === 0) {
        return <p className="text-gray-600 p-4 bg-gray-50 rounded-md">Vous n'avez aucune réservation pour le moment.</p>;
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Réservation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professionnel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure Dem.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consultation Prévue</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((res) => (
                        <tr key={res.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {res.professionnel?.nom} {res.professionnel?.prenom}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {/* Utilise heureReservation comme défini dans l'entité Java */}
                                {formatDateTime(res.dateReservation, res.heureReservation)} 
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                {/* Correction de la devise */}
                                {res.prix ? `${res.prix.toFixed(2)} MAD` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${res.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                    // Correction de 'VALIDE' en 'VALIDÉ' pour correspondre à l'enum Java
                                    res.statut === 'VALIDÉ' ? 'bg-green-100 text-green-800' :
                                    res.statut === 'REFUSE' || res.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                                    res.statut === 'PAYEE' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                    <FontAwesomeIcon icon={
                                        res.statut === 'EN_ATTENTE' ? faClock :
                                        // Correction de 'VALIDE' en 'VALIDÉ'
                                        res.statut === 'VALIDÉ' ? faCheckCircle :
                                        res.statut === 'REFUSE' || res.statut === 'ANNULEE' ? faTimesCircle :
                                        faInfoCircle
                                    } className="mr-1" />
                                    {res.statut}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {/* Correction de 'VALIDE' en 'VALIDÉ' */}
                                {res.statut === 'VALIDÉ' && res.consultation ? (
                                    <>
                                        <p><FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
                                            {formatDateTime(res.consultation.dateConsultation, res.consultation.heure)}
                                        </p>
                                        {res.consultation.lienVisio && (
                                            <a href={res.consultation.lienVisio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center mt-1">
                                                <FontAwesomeIcon icon={faVideo} className="mr-1" /> Rejoindre la visio
                                            </a>
                                        )}
                                    </>
                                ) : res.statut === 'VALIDÉ' && !res.consultation ? ( // Correction ici aussi
                                    <p className="text-red-500">Consultation non trouvée</p>
                                ) : (
                                    <p className="text-gray-500">N/A</p>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                {res.statut === 'EN_ATTENTE' && (
                                    <button
                                        onClick={() => handleAnnulerReservation(res.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Annuler cette réservation"
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} /> Annuler
                                    </button>
                                )}
                                <button
                                    onClick={() => showReservationDetails(res)} // Utilise la nouvelle fonction
                                    className="text-blue-600 hover:text-blue-900 ml-3"
                                    title="Voir les détails"
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} /> Détails
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MesReservations;
