import React from 'react';
import { CalendarCheck, Clock, User, X } from 'lucide-react';
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

  const formatDateComplete = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm bg-white/40 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-blue-600" />
              <h3 className="text-2xl font-semibold">
                Créneaux pour {pro?.prenom || ''} {pro?.nom || ''}
              </h3>
            </div>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center mt-10">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-6 mt-2">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border rounded-xl p-5 shadow-sm bg-gray-50">
                      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-blue-800 font-medium">
                          <CalendarCheck size={18} />
                          <span>{formatDateComplete(dispo.date)}</span>
                        </div>
                        <div className="text-sm text-gray-700 flex items-center gap-2 mt-2 md:mt-0">
                          <Clock size={16} />
                          {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-3">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservationsActives.find(resv =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation === heure
                          );
                          const dejaReserve = reservationsActives.some(resv =>
                            resv.heureConsultation === heure &&
                            ['EN_ATTENTE', 'EN_ATTENTE_PAIEMENT', 'PAYEE'].includes(resv.statut)
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm shadow transition"
                              >
                                {formatHeureAvecH(heure)} – Payer
                              </button>
                            );
                          } else if (dejaReserve) {
                            return (
                              <span
                                key={`occupe-${heure}-${i}`}
                                className="px-4 py-1 text-sm rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
                              >
                                {formatHeureAvecH(heure)} – Réservé
                              </span>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm shadow transition"
                              >
                                {formatHeureAvecH(heure)} – Réserver
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
