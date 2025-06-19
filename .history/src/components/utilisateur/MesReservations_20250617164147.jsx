import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAnnulation, setLoadingAnnulation] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations/mes-reservations', { withCredentials: true });
        setReservations(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservations();
  }, []);

  const handleAnnuler = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;

    try {
      setLoadingAnnulation(true);
      await axios.delete(`/api/reservations/annuler/${id}`, { withCredentials: true });
      // Retirer la réservation annulée de la liste ou la mettre à jour
      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, statut: 'ANNULÉE' } : res)
      );
    } catch (err) {
      alert("Erreur lors de l'annulation : " + err.message);
    } finally {
      setLoadingAnnulation(false);
    }
  };

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
            <li key={res.id} className="border p-4 rounded-md bg-gray-50 flex justify-between items-center">
              <div>
                <p><strong>Professionnel :</strong> {res.professionnelNom}</p>
                <p><strong>Date de réservation :</strong> {res.dateReservation}</p>
                <p><strong>Heure de réservation :</strong> {res.heureReservation}</p>
                <p><strong>Jour de consultation :</strong> {res.jourConsultation}</p>
                <p><strong>Heure de consultation :</strong> {res.heureConsultation}</p>
                <p><strong>Statut :</strong> {res.statut}</p>
                <p><strong>Prix :</strong> {res.prix} €</p>
              </div>
              {res.statut !== 'PAYEE' && res.statut !== 'ANNULÉE' && (
                <button
                  disabled={loadingAnnulation}
                  onClick={() => handleAnnuler(res.id)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Annuler
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MesReservations;
