import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, CalendarCheck, Clock, User, Euro, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300 }}
    {...props}
  >
    {children}
  </motion.button>
);

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

  // Filtre combiné sur nom professionnel et statut
  const filteredReservations = reservations.filter(res => {
    const nomOk = res.professionnelNom.toLowerCase().includes(searchTerm.toLowerCase());
    const statutOk = statutFilter === '' || res.statut === statutFilter;
    return nomOk && statutOk;
  });

  if (error) {
    return <div className="text-red-600 text-center mt-6 font-semibold">❌ Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-10 bg-indigo-50">
      {/* Colonne recherche */}
      <aside className="w-64 mr-10 sticky top-24 self-start bg-white p-6 rounded-xl shadow-md h-fit">
        <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
          <Search size={24} /> Filtres
        </h3>
        <div className="mb-6">
          <label htmlFor="search" className="block mb-1 font-semibold text-gray-700">
            Rechercher un professionnel
          </label>
          <input
            id="search"
            type="search"
            placeholder="Nom du professionnel"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="statut" className="block mb-1 font-semibold text-gray-700">
            Filtrer par statut
          </label>
          <select
            id="statut"
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <main className="flex-1 max-w-4xl">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 flex items-center gap-3">
          <CalendarCheck size={36} /> Mes Réservations
        </h2>

        {filteredReservations.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Aucune réservation trouvée.</p>
        ) : (
          <ul className="space-y-8">
            <AnimatePresence>
              {filteredReservations.map((res) => (
                <motion.li
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="border border-indigo-200 rounded-xl bg-indigo-50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md"
                >
                  <div className="space-y-2 md:w-3/4">
                    <p className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                      <User size={20} /> Docteur : {res.professionnelNom}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <CalendarCheck size={18} /> Date de réservation : <time dateTime={res.dateReservation}>{res.dateReservation}</time>
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Clock size={18} /> Heure de réservation : {res.heureReservation || 'Non précisée'}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <CalendarCheck size={18} /> Jour de consultation : {res.jourConsultation || 'Non précisé'}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Clock size={18} /> Heure de consultation : {res.heureConsultation || 'Non précisée'}
                    </p>
                    <p className="text-indigo-800 font-semibold">
                      Statut : <span className={
                        res.statut === 'ANNULEE' ? 'text-red-600' :
                        res.statut === 'PAYEE' ? 'text-green-600' :
                        res.statut === 'EN_ATTENTE_PAIEMENT' ? 'text-yellow-600' :
                        'text-indigo-700'
                      }>{res.statut.replace('_', ' ')}</span>
                    </p>
                    <p className="text-gray-900 font-semibold flex items-center gap-1">
                      <Euro size={16} /> {res.prix} €
                    </p>
                  </div>

                  {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                    <AnimatedButton
                      disabled={loadingAnnulation}
                      onClick={() => handleAnnuler(res.id)}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 shadow-lg transition"
                      aria-label="Annuler la réservation"
                      title="Annuler la réservation"
                    >
                      <Trash2 size={20} />
                      Annuler
                    </AnimatedButton>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </main>
    </div>
  );
};

export default MesReservations;
