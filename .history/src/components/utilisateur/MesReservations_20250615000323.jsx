import React, { useState, useEffect, useCallback } from 'react';
import { getReservationsUtilisateur, annulerReservationUtilisateur } from '../../services/serviceUtilisateur';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimesCircle, faClock, faVideo, faCalendarCheck, faInfoCircle, faDollarSign, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const MesReservations = ({ onError, onShowConfirm, onShowInfo }) => {
    const [reservations, setReservations] = useState([]);

    const fetchMesReservations = useCallback(async () => {
        try {
            const data = await getReservationsUtilisateur();
            setReservations(data);
        } catch (err) {
            console.error("Erreur lors de la récupération des réservations de l'utilisateur:", err);
            onError("Impossible de charger vos réservations. Veuillez vous reconnecter.");
        }
    }, [onError]);

    useEffect(() => {
        fetchMesReservations();
    }, [fetchMesReservations]);

    const handleAnnulerReservation = (reservationId) => {
        onShowConfirm(
            "Êtes-vous sûr de vouloir annuler cette réservation ?",
            async () => {
                try {
                    await annulerReservationUtilisateur(reservationId);
                    fetchMesReservations();
                } catch (err) {
                    console.error("Erreur lors de l'annulation de la réservation :", err.response ? err.response.data : err.message);
                    onError(`Erreur lors de l'annulation : ${err.response?.data?.message || err.message}`);
                }
            }
        );
    };

    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        try {
            const dateTime = new Date(`${dateString}T${timeString || '00:00'}:00`);
            if (isNaN(dateTime.getTime())) {
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
            return `${dateString} ${timeString || ''}`;
        }
    };

    const showReservationDetails = (res) => {
        const details = `
Détails de la réservation ${res.id}:
Professionnel: ${res.professionnel?.nom} ${res.professionnel?.prenom}
Date Demande: ${formatDateTime(res.dateReservation, res.heureReservation)}
Statut: ${res.statut}
Prix: ${res.prix ? `${res.prix.toFixed(2)} MAD` : 'N/A'}
Consultation: ${res.consultation ? `Date: ${formatDateTime(res.consultation.dateConsultation, res.consultation.heure)}, Prix: ${res.consultation.prix || 'N/A'} MAD` : 'Non créée'}
        `;
        onShowInfo("Détails de la réservation", details);
    };

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
                                {formatDateTime(res.dateReservation, res.heureReservation)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                {res.prix ? `${res.prix.toFixed(2)} MAD` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${res.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                    res.statut === 'VALIDÉ' ? 'bg-green-100 text-green-800' :
                                    res.statut === 'REFUSE' || res.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                                    res.statut === 'PAYEE' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                    <FontAwesomeIcon icon={
                                        res.statut === 'EN_ATTENTE' ? faClock :
                                        res.statut === 'VALIDÉ' ? faCheckCircle :
                                        res.statut === 'REFUSE' || res.statut === 'ANNULEE' ? faTimesCircle :
                                        faInfoCircle
                                    } className="mr-1" />
                                    {res.statut}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                                ) : res.statut === 'VALIDÉ' && !res.consultation ? (
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
                                    onClick={() => showReservationDetails(res)}
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
