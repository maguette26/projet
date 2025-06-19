import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock, User, Euro, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const MesConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [statut, setStatut] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await axios.get('/api/consultations/mes-consultations', { withCredentials: true });
        setConsultations(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchConsultations();
  }, []);

  const filteredConsultations = consultations.filter(c =>
    statut ? c.statut === statut : true
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" />
      
      {/* Titre + Filtre */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <motion.h2
          className="text-4xl font-extrabold text-indigo-700 flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <MessageSquare size={32} /> Mes Consultations
        </motion.h2>

        <div className="flex gap-3 items-center">
          <SlidersHorizontal className="text-gray-500" />
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="border border-indigo-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">🕒 En attente</option>
            <option value="CONFIRMEE">🔵 Confirmée</option>
            <option value="TERMINEE">✅ Terminée</option>
            <option value="ANNULEE">❌ Annulée</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-6">{error}</p>
      )}

      {filteredConsultations.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Aucune consultation trouvée.</p>
      ) : (
        <ul className="space-y-6">
          <AnimatePresence>
            {filteredConsultations.map((c) => (
              <motion.li
                key={c.idConsultation}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2 text-sm md:text-base max-w-xl">
                  <p className="text-indigo-900 font-semibold flex items-center gap-2">
                    <User size={18} /> Docteur : {c.professionnel?.nom || '—'}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <CalendarCheck size={16} /> Date : {new Date(c.dateConsultation).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock size={16} /> Heure : {c.heure?.substring(0, 5) || '—'}
                  </p>
                  <p className="text-gray-800 font-medium">
                    Statut : <span className={
                      c.statut === 'ANNULEE' ? 'text-red-600' :
                      c.statut === 'TERMINEE' ? 'text-green-600' :
                      c.statut === 'EN_ATTENTE' ? 'text-yellow-600' : 'text-indigo-500'
                    }>{c.statut}</span>
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-1">Prix :
                    <Euro size={14} /> {c.prix?.toFixed(2) || '—'}
                  </p>

                  {/* Note utilisateur */}
                  {c.notesUtilisateur && (
                    <p className="text-gray-700 italic text-sm mt-2">
                      <strong>Votre note :</strong> {c.notesUtilisateur}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info(`Consultation avec ${c.professionnel?.nom || 'le professionnel'} le ${new Date(c.dateConsultation).toLocaleDateString()}`)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Voir détails
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default MesConsultations;
