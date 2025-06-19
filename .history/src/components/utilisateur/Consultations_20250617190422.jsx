import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statutStyles = {
  CONFIRMEE: { color: 'green', label: 'Confirmée' },
  EN_ATTENTE: { color: 'orange', label: 'En attente' },
  ANNULE: { color: 'red', label: 'Annulée' },
  // ajoute d'autres statuts si besoin
};

function MesConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/consultations/mes-consultations')
      .then(res => {
        setConsultations(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des consultations');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Mes consultations</h2>
      {consultations.length === 0 && <p>Aucune consultation trouvée.</p>}
      <ul>
        {consultations.map(c => {
          const statut = c.statut || 'INCONNU';
          const style = statutStyles[statut] || { color: 'gray', label: statut };

          return (
            <li key={c.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <div><strong>Date :</strong> {new Date(c.date).toLocaleDateString()}</div>
              <div><strong>Heure :</strong> {c.heure}</div>
              <div><strong>Prix :</strong> {c.prix} €</div>
              <div>
                <strong>Statut :</strong>{' '}
                <span style={{ color: style.color, fontWeight: 'bold' }}>{style.label}</span>
              </div>
              <div><strong>Professionnel :</strong> {c.professionnelPrenom} {c.professionnelNom}</div>
              {c.notesProfessionnel && <div><strong>Notes pro :</strong> {c.notesProfessionnel}</div>}
              {c.notesUtilisateur && <div><strong>Mes notes :</strong> {c.notesUtilisateur}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MesConsultations;
