import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations/mes-reservations', {
          withCredentials: true,  
        });
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
            <li key={res.id} className="border p-3 rounded-md">
              <p><strong>Date :</strong> {res.dateReservation}</p>
              <p><strong>Heure :</strong> {res.heureReservation}</p>
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
