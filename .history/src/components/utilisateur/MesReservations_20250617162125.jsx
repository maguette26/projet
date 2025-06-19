import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations/mes-reservations', { withCredentials: true });
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        setReservations(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération :', err);
        setError(err.message);
      }
    };

    fetchReservations();
  }, []);

  if (error) {
    return <div className="text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Mes Réservations</h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <ul className="space-y-3">
          {reservations.map((res) => (
            <li key={res.id} className="border p-4 rounded-md bg-gray-50">
              <p><strong>Professionnel :</strong> {res.nomProfessionnel}</p>
              <p><strong>Date de réservation :</strong> {res.dateReservation}</p>
              <p><strong>Heure de réservation :</strong> {res.heureReservation}</p>
              <p><strong>Jour de consultation :</strong> {res.jourConsultation}</p>
              <p><strong>Heure de consultation :</strong> {res.heureConsultation}</p>
              <p><strong>Statut :</strong> {res.statut}</p>
              <p><strong>Prix :</strong> {res.prix} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MesReservations;
