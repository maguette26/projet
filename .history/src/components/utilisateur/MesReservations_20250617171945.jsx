import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Trash2, CalendarCheck, Clock, User, Euro, Download, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [statutFiltre, setStatutFiltre] = useState('');
  const [loadingAnnulation, setLoadingAnnulation] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations/mes-reservations', { withCredentials: true });
        setReservations(response.data);
      } catch (err) {
        toast.error("Erreur de chargement des réservations");
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
      toast.success("Réservation annulée !");
    } catch (err) {
      toast.error("Erreur lors de l'annulation");
    } finally {
      setLoadingAnnulation(false);
    }
  };

  const handleTelechargerRecu = async (id) => {
    try {
      const response = await axios.get(`/api/reservations/telecharger-recu/${id}`, {
        responseType: 'blob',
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recu_reservation_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Erreur lors du téléchargement du reçu");
    }
  };

  const filteredReservations = statutFiltre
    ? reservations.filter(res => res.statut === statutFiltre)
    : reservations;

  const statuts = ['PAYEE', 'EN_ATTENTE', 'EN_ATTENTE_PAIEMENT', 'ANNULEE'];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-3xl mt-10">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-3 mb-6">
        <CalendarCheck size={32} /> Mes Réservations
      </h2>

      <div className="flex justify-end mb-6">
        <motion.select
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          value={statutFiltre}
          onChange={(e) => setStatutFiltre(e.target.value)}
          className="border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 shadow-sm"
        >
          <option value="">📋 Tous les statuts</option>
          {statuts.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </motion.select>
      </div>

      {filteredReservations.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Aucune réservation trouvée.</p>
      ) : (
        <ul className="space-y-8">
          <AnimatePresence>
            {filteredReservations.map(res => (
              <motion.li
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border border-indigo-100 rounded-xl bg-indigo-50 p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 text-sm md:w-3/4">
                  <p className="font-semibold text-indigo-800 flex items-center gap-2">
                    <User size={18} /> Docteur : {res.professionnelNom}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <CalendarCheck size={16} /> Réservé le : {res.dateReservation}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock size={16} /> Heure : {res.heureReservation || 'Non précisée'}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <CalendarCheck size={16} /> Jour consultation : {res.jourConsultation || 'N/A'}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock size={16} /> Heure consultation : {res.heureConsultation || 'N/A'}
                  </p>
                  <p className="text-indigo-800 font-semibold">
                    Statut : <span className={
                      res.statut === 'ANNULEE' ? 'text-red-600' :
                        res.statut === 'PAYEE' ? 'text-green-600' :
                          res.statut === 'EN_ATTENTE_PAIEMENT' ? 'text-yellow-600' :
                            'text-blue-600'
                    }>
                      {res.statut}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold flex items-center gap-1">
                    <Euro size={14} /> {res.prix} €
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnnuler(res.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md"
                      disabled={loadingAnnulation}
                    >
                      <Trash2 size={16} className="inline-block mr-1" />
                      Annuler
                    </motion.button>
                  )}

                  {res.statut === 'PAYEE' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTelechargerRecu(res.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md"
                    >
                      <Download size={16} className="inline-block mr-1" />
                      Ticket PDF
                    </motion.button>
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
