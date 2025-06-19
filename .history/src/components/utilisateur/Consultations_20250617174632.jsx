import React, { useEffect, useState } from 'react';
import { Clock, Calendar, UserCheck, XCircle } from 'lucide-react';

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/reservations/mes-reservations', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
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

  if (loading) return <p className="text-center mt-8 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Erreur : {error}</p>;
  if (reservations.length === 0) return <p className="text-center mt-8 text-gray-500">Aucune réservation trouvée.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mes Réservations</h2>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={16} /> Date Réservation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock size={16} /> Heure Réservation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (€)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <UserCheck size={16} /> Professionnel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={16} /> Jour Consultation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock size={16} /> Heure Consultation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{r.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(r.dateReservation).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.heureReservation || <XCircle className="inline-block text-red-400" size={16} />}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                  r.statut === 'EN_ATTENTE' ? 'text-yellow-600' :
                  r.statut === 'ACCEPTEE' ? 'text-green-600' :
                  r.statut === 'REFUSEE' ? 'text-red-600' : 'text-gray-600'}`}>
                  {r.statut}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.prix.toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{r.professionnelNom}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {r.jourConsultation ? new Date(r.jourConsultation).toLocaleDateString() : <XCircle className="inline-block text-red-400" size={16} />}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.heureConsultation || <XCircle className="inline-block text-red-400" size={16} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MesReservations;
