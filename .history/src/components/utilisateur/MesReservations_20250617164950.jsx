import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, CalendarDays, Clock, User, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const statutEmojis = {
  EN_ATTENTE: '⌛',
  EN_ATTENTE_PAIEMENT: '💳',
  PAYEE: '✅',
  REFUSE: '❌',
  ANNULEE: '🚫',
};

const statutColors = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  EN_ATTENTE_PAIEMENT: 'bg-orange-100 text-orange-800',
  PAYEE: 'bg-green-100 text-green-800',
  REFUSE: 'bg-red-100 text-red-800',
  ANNULEE: 'bg-gray-200 text-gray-600',
};

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
        prev.map(res => (res.id === id ? { ...res, statut: 'ANNULEE' } : res))
      );
      toast.success('Réservation annulée avec succès ! 🎉');
    } catch (err) {
      toast.error(`Erreur lors de l'annulation : ${err.message}`);
    } finally {
      setLoadingAnnulation(false);
    }
  };

  if (error) {
    return <div className="text-red-600 font-semibold p-4">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">📅 Mes Réservations</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Aucune réservation trouvée.</p>
      ) : (
        <ul className="space-y-8">
          <AnimatePresence>
            {reservations.map((res) => (
              <motion.li
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-2 text-gray-800 w-full md:w-4/5">
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <User size={20} className="text-indigo-600" />
                    Docteur : <span className="ml-1 text-indigo-900">{res.professionnelNom}</span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={18} className="text-green-600" />
                    Date de réservation : <span className="font-medium">{res.dateReservation}</span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock size={18} className="text-yellow-600" />
                    Heure réservation : <span className="font-medium">{res.heureReservation || '-'}</span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={18} className="text-green-600" />
                    Jour consultation : <span className="font-medium">{res.jourConsultation || '-'}</span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock size={18} className="text-yellow-600" />
                    Heure consultation : <span className="font-medium">{res.heureConsultation || '-'}</span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <Tag size={18} className="text-purple-600" />
                    Statut :{' '}
                    <span
                      className={`ml-2 px-3 py-1 rounded-full font-semibold text-sm ${statutColors[res.statut] || 'bg-gray-100 text-gray-700'}`}
                      title={`Statut : ${res.statut}`}
                    >
                      {statutEmojis[res.statut] || ''} {res.statut}
                    </span>
                  </p>

                  <p className="flex items-center gap-2 text-gray-700 text-lg font-semibold">
                    Prix : <span className="text-indigo-700">{res.prix} €</span> 💶
                  </p>
                </div>

                {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                  <button
                    onClick={() => handleAnnuler(res.id)}
                    disabled={loadingAnnulation}
                    className="mt-6 md:mt-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 shadow-lg transition"
                    aria-label="Annuler la réservation"
                    title="Annuler la réservation"
                  >
                    <Trash2 size={20} />
                    Annuler
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default MesReservations;
