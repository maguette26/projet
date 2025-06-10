// src/components/professionel/ListeReservations.jsx
import React from 'react';
import { updateReservationStatus } from '../../services/servicePsy'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faVideo, faCalendarCheck, faInfoCircle, faClock } from '@fortawesome/free-solid-svg-icons';


const ListeReservations = ({ reservations, onReservationUpdated, onError }) => {

    const handleUpdateStatus = async (reservationId, status) => {
        if (!window.confirm(`Confirmer ${status === 'ACCEPTED' ? 'l\'acceptation' : 'le refus'} de cette réservation ?`)) {
            return;
        }
        try {
            await updateReservationStatus(reservationId, status);
            onReservationUpdated(); 
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut de la réservation ${reservationId} :`, error);
            onError(`Erreur lors de la mise à jour de la réservation : ${error.response?.data?.message || error.message}`);
        }
    };

    if (!reservations || reservations.length === 0) {
        return <p className="text-gray-600 p-4 bg-gray-50 rounded-md">Aucune réservation trouvée pour le moment.</p>;
    }

    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        try {
            const dt = new Date(`${dateString}T${timeString || '00:00'}:00`); // Combine date and time string
            return dt.toLocaleDateString('fr-FR', {
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

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Réservation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure Dem.</th>
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
                                {res.utilisateur?.nom} {res.utilisateur?.prenom} ({res.utilisateur?.email})
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatDateTime(res.dateReservation, res.heureDebut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${res.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                    res.statut === 'VALIDE' ? 'bg-green-100 text-green-800' : // Changé 'ACCEPTED' en 'VALIDE' pour correspondre au backend
                                    res.statut === 'REFUSE' ? 'bg-red-100 text-red-800' : // Changé 'REJECTED' en 'REFUSE'
                                    res.statut === 'PAYEE' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                    <FontAwesomeIcon icon={
                                        res.statut === 'EN_ATTENTE' ? faClock :
                                        res.statut === 'VALIDE' ? faCheckCircle :
                                        res.statut === 'REFUSE' ? faTimesCircle :
                                        faInfoCircle
                                    } className="mr-1" />
                                    {res.statut}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {res.statut === 'VALIDE' && res.consultation ? (
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
                                ) : res.statut === 'VALIDE' && !res.consultation ? (
                                    <p className="text-red-500">Consultation non trouvée</p>
                                ) : (
                                    <p className="text-gray-500">N/A</p>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {res.statut === 'EN_ATTENTE' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(res.id, 'VALIDE')}
                                            className="text-green-600 hover:text-green-900 mr-3"
                                            title="Accepter la réservation"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} /> Accepter
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(res.id, 'REFUSE')}
                                            className="text-red-600 hover:text-red-900"
                                            title="Refuser la réservation"
                                        >
                                            <FontAwesomeIcon icon={faTimesCircle} /> Refuser
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => alert(`Détails de la réservation ${res.id}:\nUtilisateur: ${res.utilisateur?.nom} ${res.utilisateur?.prenom}\nDate Demande: ${formatDateTime(res.dateReservation, res.heureDebut)}\nStatut: ${res.statut}\nPrix: ${res.prix ? `${res.prix} $` : 'N/A'}\nConsultation: ${res.consultation ? `Date: ${formatDateTime(res.consultation.dateConsultation, res.consultation.heure)}, Prix: ${res.consultation.prix || 'N/A'} $` : 'Non créée'}`)}
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

export default ListeReservations;
