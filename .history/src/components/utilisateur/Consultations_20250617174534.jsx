import React, { useEffect, useState } from 'react';

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/reservations/mes-reservations', {
      credentials: 'include', // si tu utilises cookie/session
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || 'Erreur réseau');
        }
        return res.json();
      })
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (reservations.length === 0) return <p>Aucune réservation trouvée.</p>;

  return (
    <div>
      <h2>Mes Réservations</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Réservation</th>
            <th>Heure Réservation</th>
            <th>Statut</th>
            <th>Prix (€)</th>
            <th>Professionnel</th>
            <th>Jour Consultation</th>
            <th>Heure Consultation</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{new Date(r.dateReservation).toLocaleDateString()}</td>
              <td>{r.heureReservation || '-'}</td>
              <td>{r.statut}</td>
              <td>{r.prix.toFixed(2)}</td>
              <td>{r.professionnelNom}</td>
              <td>{r.jourConsultation ? new Date(r.jourConsultation).toLocaleDateString() : '-'}</td>
              <td>{r.heureConsultation || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MesReservations;
