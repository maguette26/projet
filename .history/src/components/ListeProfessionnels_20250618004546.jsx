import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListeDisponibilites = ({ professionnelId }) => {
  const [disponibilites, setDisponibilites] = useState([]);

  useEffect(() => {
    if (!professionnelId) return;
    axios
      .get(`/api/disponibilites/professionnel/${professionnelId}`)
      .then((res) => setDisponibilites(res.data))
      .catch((err) => {
        console.error('Erreur chargement disponibilités:', err);
        toast.error("Impossible de charger les disponibilités.");
      });
  }, [professionnelId]);

  const reserverCreneau = async (dispo) => {
    if (!dispo?.id || !dispo.date || !dispo.heureDebut) {
      toast.error("Données incomplètes pour la réservation.");
      return;
    }

    const reservation = {
      disponibilite: { id: dispo.id },
      dateReservation: dispo.date, // ex: "2025-10-12"
      heureReservation: dispo.heureDebut, // ex: "09:00:00"
    };

    try {
      const response = await axios.post('/api/reservations', reservation, {
        withCredentials: true,
      });
      toast.success('Réservation effectuée avec succès.');
    } catch (error) {
      console.error('Erreur serveur:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || 'Erreur lors de la réservation.'
      );
    }
  };

  return (
    <div>
      <h2>Créneaux disponibles</h2>
      {disponibilites.length === 0 ? (
        <p>Aucun créneau disponible</p>
      ) : (
        <ul>
          {disponibilites.map((dispo) => (
            <li key={`${dispo.id}-${dispo.heureDebut}`}>
              Le {dispo.date} de {dispo.heureDebut} à {dispo.heureFin}
              <button
                onClick={() => reserverCreneau(dispo)}
                disabled={dispo.reservee}
                style={{ marginLeft: '10px' }}
              >
                {dispo.reservee ? 'Réservé' : 'Réserver'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListeDisponibilites;
