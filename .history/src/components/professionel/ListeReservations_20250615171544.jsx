// src/components/professionel/ListeReservations.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faVideo, faCalendarCheck, faInfoCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const ListeReservations = ({ proId }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:9191/api/reservations.pro/${proId}`);
        setReservations(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
        setError("Erreur lors du chargement des réservations");
      }
    };

    if (proId) {
      fetchReservations();
    }
  }, [proId]);

  const handleUpdateStatus = async (reservationId, status) => {
    if (!window.confirm(`Confirmer ${status === 'VALIDE' ? 'l\'acceptation' : 'le refus'} de cette réservation ?`)) {
      return;
    }

    try {
      await axios.put(`http://localhost:9191/api/reservations/${reservationId}/statut`, { statut: status });
      // Recharger les données après mise à jour
      const updated = await axios.get(`http://localhost:9191/api/pro/${proId}`);
      setReservations(updated.data);
    } catch (error) {
      console.error("Erreur mise à jour statut :", error);
      setError("Erreur lors de la mise à jour de la réservation");
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    try {
      const dt = new Date(`${dateString}T${timeString || '00:00'}:00`);
      return dt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return `${dateString} ${timeString || ''}`;
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!reservations || reservations.length === 0) {
    return <p className="text-gray-600 p-4 bg-gray-50 rounded-md">Aucune réservation trouvée pour le moment.</p>;
  }

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
              <td className="px-6 py-4">{res.id}</td>
              <td className="px-6 py-4">{res.utilisateur?.nom} {res.utilisateur?.prenom} ({res.utilisateur?.email})</td>
              <td className="px-6 py-4">{formatDateTime(res.dateReservation, res.heureDebut)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${res.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                      res.statut === 'VALIDE' ? 'bg-green-100 text-green-800' :
                      res.statut === 'REFUSE' ? 'bg-red-100 text-red-800' :
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
              <td className="px-6 py-4">
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
              <td className="px-6 py-4 text-right">
                {res.statut === 'EN_ATTENTE' && (
                  <>
                    <button onClick={() => handleUpdateStatus(res.id, 'VALIDE')} className="text-green-600 hover:text-green-900 mr-3">
                      <FontAwesomeIcon icon={faCheckCircle} /> Accepter
                    </button>
                    <button onClick={() => handleUpdateStatus(res.id, 'REFUSE')} className="text-red-600 hover:text-red-900">
                      <FontAwesomeIcon icon={faTimesCircle} /> Refuser
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    alert(`Détails de la réservation ${res.id}:\nUtilisateur: ${res.utilisateur?.nom} ${res.utilisateur?.prenom}\nDate Demande: ${formatDateTime(res.dateReservation, res.heureDebut)}\nStatut: ${res.statut}\nPrix: ${res.prix ? `${res.prix} $` : 'N/A'}\nConsultation: ${res.consultation ? `Date: ${formatDateTime(res.consultation.dateConsultation, res.consultation.heure)}, Prix: ${res.consultation.prix || 'N/A'} $` : 'Non créée'}`)}
                  className="text-blue-600 hover:text-blue-900 ml-3"
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
