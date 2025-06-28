import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock, User, Euro, TicketCheck, SlidersHorizontal, XCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Important pour l'accessibilité

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [statut, setStatut] = useState('');
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

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

  const handleDownloadTicket = async (id) => {
    try {
      const response = await axios.get(`/api/reservations/telecharger-recu/${id}`, {
        responseType: 'blob',
        withCredentials: true,
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recu_reservation_${id}.pdf`;
      link.click();
      toast.success('🎟️ Ticket téléchargé avec succès !');
    } catch (err) {
      toast.error("Erreur lors du téléchargement !");
    }
  };

  const openCancelModal = (reservation) => {
    setReservationToCancel(reservation);
    setModalOpen(true);
  };

  const closeCancelModal = () => {
    setModalOpen(false);
    setReservationToCancel(null);
  };

  const handleAnnulerReservation = async () => {
    if (!reservationToCancel) return;
    try {
      await axios.delete(`/api/reservations/annuler/${reservationToCancel.id}`, { withCredentials: true });
      toast.success("❌ Réservation annulée avec succès !");
      setReservations((prev) => prev.filter(r => r.id !== reservationToCancel.id));
    } catch (err) {
      toast.error("Erreur lors de l'annulation !");
    } finally {
      closeCancelModal();
    }
  };

  const filteredReservations = reservations.filter((res) =>
    statut ? res.statut === statut : true
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" />

      {/* Filtrage */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <motion.h2
          className="text-4xl font-extrabold text-indigo-700 flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <CalendarCheck size={32} /> Mes Réservations
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
            <option value="EN_ATTENTE_PAIEMENT">💳 En attente de paiement</option>
            <option value="PAYEE">✅ Payée</option>
            <option value="ANNULEE">❌ Annulée</option>
          </select>
        </div>
      </div>

      {/* Liste des réservations */}
      <ul className="space-y-6">
        <AnimatePresence>
          {filteredReservations.map((res) => (
            <motion.li
              key={res.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2 text-sm md:text-base">
                <p className="text-indigo-900 font-semibold flex items-center gap-2">
                  <User size={18} /> Docteur : {res.professionnelNom}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <CalendarCheck size={16} /> Date : {res.dateReservation}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Clock size={16} /> Heure réservation : {res.heureReservation || '—'}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Clock size={16} /> Consultation : {res.jourConsultation || '—'} à {res.heureConsultation || '—'}
                </p>
                <p className="text-gray-800 font-medium">
                  Statut : <span className={
                    res.statut === 'ANNULEE' ? 'text-red-600' :
                    res.statut === 'PAYEE' ? 'text-green-600' :
                    res.statut === 'EN_ATTENTE_PAIEMENT' ? 'text-yellow-600' : 'text-indigo-500'
                  }>{res.statut}</span>
                </p>
                <p className="text-gray-800 font-medium flex items-center gap-1">Prix:
                  <Euro size={14} /> {res.prix}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {res.statut === 'PAYEE' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadTicket(res.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2"
                  >
                    <TicketCheck size={18} /> Télécharger le ticket
                  </motion.button>
                )}

                {(res.statut === 'EN_ATTENTE' || res.statut === 'EN_ATTENTE_PAIEMENT') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openCancelModal(res)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2"
                  >
                    <XCircle size={18} /> Annuler la réservation
                  </motion.button>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* MODALE d'annulation */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeCancelModal}
        contentLabel="Confirmation d'annulation"
        className="bg-white p-6 rounded-xl max-w-md mx-auto mt-40 shadow-xl border"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
      >
        <h2 className="text-xl font-bold text-red-600 mb-4">Confirmer l'annulation</h2>
        <p className="mb-6 text-gray-700">
          Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeCancelModal}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleAnnulerReservation}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Oui, annuler
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MesReservations;
