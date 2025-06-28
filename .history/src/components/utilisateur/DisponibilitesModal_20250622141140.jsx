import React from 'react';
import { CalendarCheck, Clock, X, User, CreditCard, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, onReserver, onPayer, onClose }) => {
  const formatHeureAvecH = (heureStr) => {
    if (!heureStr) return '';
    const [heures, minutes] = heureStr.split(':');
    return `${heures}h${minutes}`;
  };

  const genererSousCreneaux = (dispo, dureeMinutes = 15) => {
    const sousCreneaux = [];
    if (!dispo.heureDebut || !dispo.heureFin) return sousCreneaux;

    const toMinutes = (hms) => {
      const [h, m] = hms.split(':').map(Number);
      return h * 60 + m;
    };

    const fromMinutes = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    };

    const debut = toMinutes(dispo.heureDebut);
    const fin = toMinutes(dispo.heureFin);

    for (let t = debut; t + dureeMinutes <= fin; t += dureeMinutes) {
      sousCreneaux.push(fromMinutes(t));
    }

    return sousCreneaux;
  };

  const getNomJour = (dateStr) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex items-center justify-center gap-2 mb-6">
              <User size={24} className="text-indigo-600" />
              <h3 className="text-2xl font-semibold text-gray-800 text-center">
                Créneaux pour {pro?.prenom || '...'} {pro?.nom || ''}
              </h3>
            </div>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-5">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border p-5 rounded-xl shadow-sm bg-gray-50">
                      <p className="font-semibold text-lg text-gray-800 mb-1 flex items-center gap-2">
                        <CalendarCheck size={18} className="text-indigo-500" />
                        {getNomJour(dispo.date)}
                      </p>
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <Clock size={16} /> {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservationsActives.find(
                            (resv) =>
                              resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                              resv.statutValidation === 'VALIDE' &&
                              resv.heureConsultation === heure
                          );

                          const dejaReserve = reservationsActives.find(
                            (resv) =>
                              ['EN_ATTENTE', 'EN_ATTENTE_PAIEMENT', 'PAYEE'].includes(resv.statut) &&
                              resv.heureConsultation === heure
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all shadow-sm text-sm font-medium"
                              >
                                <CreditCard size={16} className="text-yellow-600" />
                                {formatHeureAvecH(heure)} - Payer
                              </button>
                            );
                          } else if (dejaReserve) {
                            return (
                              <button
                                key={`reserved-${dispo.id}-${heure}-${i}`}
                                disabled
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed text-sm font-medium"
                              >
                                <Ban size={16} className="text-gray-500" />
                                {formatHeureAvecH(heure)} - Réservé
                              </button>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-all shadow-sm text-sm font-medium"
                              >
                                <Clock size={16} className="text-green-700" />
                                {formatHeureAvecH(heure)} - Réserver
                              </button>
                            );
                          }
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default DisponibilitesModal;