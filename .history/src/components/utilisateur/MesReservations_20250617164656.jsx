import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

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
      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, statut: 'ANNULEE' } : res)
      );
    } catch (err) {
      alert("Erreur lors de l'annulation : " + err.message);
    } finally {
      setLoadingAnnulation(false);
    }
  };

  if (error) {
    return <div className="text-red-600 font-semibold p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Mes Réservations</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-600 text-center">Aucune réservation trouvée.</p>
      ) : (
        <ul className="space-y-6">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200 rounded-md p-5 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-1 text-gray-700">
                <p><span className="font-semibold">Docteur :</span> {res.professionnelNom}</p>
                <p><span className="font-semibold">Date réservation :</span> {res.dateReservation}</p>
                <p><span className="font-semibold">Heure réservation :</span> {res.heureReservation || '-'}</p>
                <p><span className="font-semibold">Jour consultation :</span> {res.jourConsultation || '-'}</p>
                <p><span className="font-semibold">Heure consultation :</span> {res.heureConsultation || '-'}</p>
                <p><span className="font-semibold">Statut :</span> 
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    res.statut === 'ANNULEE' ? 'bg-red-100 text-red-700' :
                    res.statut === 'PAYEE' ? 'bg-green-100 text-green-700' :
                    res.statut === 'EN_ATTENTE_PAIEMENT' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {res.statut}
                  </span>
                </p>
                <p><span className="font-semibold">Prix :</span> {res.prix} €</p>
              </div>

              {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                <button
                  onClick={() => handleAnnuler(res.id)}
                  disabled={loadingAnnulation}
                  className="mt-4 md:mt-0 flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition"
                  title="Annuler la réservation"
                  aria-label="Annuler la réservation"
                >
                  <Trash2 size={18} />
                  <span>Annuler</span>
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
