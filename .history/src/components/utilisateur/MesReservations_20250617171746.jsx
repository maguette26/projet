import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, CalendarCheck, Clock, User, Euro, Download } from 'lucide-react';
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

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAnnulation, setLoadingAnnulation] = useState(false);
  const [searchStatut, setSearchStatut] = useState('');

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

  const filteredReservations = reservations.filter(res =>
    searchStatut === '' || res.statut === searchStatut
  );

  if (error) {
    return <div className="text-red-600 text-center mt-6 font-semibold">❌ Erreur : {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 flex items-center gap-3 justify-center">
        <CalendarCheck size={36} /> Mes Réservations
      </h2>

      <div className="flex justify-end mb-6">
        <motion.select
          value={searchStatut}
          onChange={(e) => setSearchStatut(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="px-4 py-2 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-700 shadow"
        >
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="EN_ATTENTE_PAIEMENT">En attente de paiement</option>
          <option value="PAYEE">Payée</option>
          <option value="ANNULEE">Annulée</option>
        </motion.select>
      </div>

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
                    <CalendarCheck size={18} /> Date réservation : {res.dateReservation}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock size={18} /> Heure réservation : {res.heureReservation || 'Non précisée'}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <CalendarCheck size={18} /> Jour consultation : {res.jourConsultation || 'Non précisé'}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock size={18} /> Heure consultation : {res.heureConsultation || 'Non précisée'}
                  </p>
                  <p className="text-indigo-800 font-semibold">
                    Statut :
                    <span className={
                      res.statut === 'ANNULEE' ? 'text-red-600' :
                      res.statut === 'PAYEE' ? 'text-green-600' :
                      res.statut === 'EN_ATTENTE_PAIEMENT' ? 'text-yellow-600' :
                      'text-indigo-700'
                    }> {res.statut}</span>
                  </p>
                  <p className="text-gray-900 font-semibold flex items-center gap-1">
                    <Euro size={16} /> {res.prix} €
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3">
                  {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                    <AnimatedButton
                      disabled={loadingAnnulation}
                      onClick={() => handleAnnuler(res.id)}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 shadow-lg transition"
                    >
                      <Trash2 size={20} />
                      Annuler
                    </AnimatedButton>
                  )}

                  {res.statut === 'PAYEE' && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={`http://localhost:9191/api/reservations/telecharger-recu/${res.id}`}
                      download={`recu_reservation_${res.id}.pdf`}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                      onClick={() => console.log(`🎫 Reçu ${res.id} téléchargé !`)}
                    >
                      <Download size={20} />
                      Télécharger le ticket PDF
                    </motion.a>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default MesReservations;
