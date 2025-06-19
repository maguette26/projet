import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Search } from 'lucide-react';

const STATUTS = [
  '',
  'EN_ATTENTE',
  'EN_ATTENTE_PAIEMENT',
  'PAYEE',
  'REFUSE',
  'ANNULEE',
];

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAnnulation, setLoadingAnnulation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

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

  // Filtrer par nom professionnel + statut
  const filteredReservations = reservations.filter(res => {
    const nomOk = res.professionnelNom.toLowerCase().includes(searchTerm.toLowerCase());
    const statutOk = statutFilter === '' || res.statut === statutFilter;
    return nomOk && statutOk;
  });

  if (error) {
    return <div className="text-red-500 text-center mt-6">Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      {/* Conteneur principal */}
      <div className="flex w-full max-w-5xl gap-10">
        {/* Recherche - filtre */}
        <aside className="w-64 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search size={20} /> Filtres
          </h3>
          <div className="mb-6">
            <label htmlFor="search" className="block mb-1 font-medium">
              Rechercher un professionnel
            </label>
            <input
              id="search"
              type="text"
              placeholder="Nom du professionnel"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="statut" className="block mb-1 font-medium">
              Filtrer par statut
            </label>
            <select
              id="statut"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUTS.map(st => (
                <option key={st} value={st}>
                  {st === '' ? 'Tous' : st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Liste réservations */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Mes Réservations</h2>

          {filteredReservations.length === 0 ? (
            <p className="text-gray-500 text-center">Aucune réservation trouvée.</p>
          ) : (
            <ul className="space-y-5">
              {filteredReservations.map(res => (
                <li key={res.id} className="bg-white rounded shadow p-5 flex justify-between items-center">
                  <div>
                    <p><strong>Docteur :</strong> {res.professionnelNom}</p>
                    <p><strong>Date de réservation :</strong> {res.dateReservation}</p>
                    <p><strong>Heure de réservation :</strong> {res.heureReservation}</p>
                    <p><strong>Jour de consultation :</strong> {res.jourConsultation}</p>
                    <p><strong>Heure de consultation :</strong> {res.heureConsultation}</p>
                    <p>
                      <strong>Statut :</strong> <span className={
                        res.statut === 'ANNULEE' ? 'text-red-600' :
                        res.statut === 'PAYEE' ? 'text-green-600' :
                        res.statut === 'EN_ATTENTE_PAIEMENT' ? 'text-yellow-600' :
                        'text-gray-800'
                      }>{res.statut.replace('_', ' ')}</span>
                    </p>
                    <p><strong>Prix :</strong> {res.prix} €</p>
                  </div>

                  {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                    <button
                      disabled={loadingAnnulation}
                      onClick={() => handleAnnuler(res.id)}
                      className="ml-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded px-4 py-2"
                      aria-label="Annuler la réservation"
                      title="Annuler la réservation"
                    >
                      <Trash2 size={18} />
                      Annuler
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default MesReservations;
