import React from 'react';
import { CalendarCheck, Clock, XCircle, UserRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, onReserver, onPayer, onClose, isLoading }) => {
  const formatHeureAvecH = (heureStr) => {
    if (!heureStr) return '';
    const [heures, minutes] = heureStr.split(':');
    return `${heures}h${minutes}`;
  };

  const formatDateAvecJour = (dateStr) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
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

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/60 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              aria-label="Fermer"
            >
              <XCircle size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <UserRound className="text-blue-600" size={28} />
              <h3 className="text-2xl font-bold">
                Créneaux pour {pro?.prenom || '...'} {pro?.nom || ''}
              </h3>
            </div>

            {isLoading ? (
              <p className="text-center text-gray-500 animate-pulse">Chargement des disponibilités...</p>
            ) : disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-5">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border p-4 rounded-xl shadow-sm">
                      <p className="font-medium mb-2 text-lg text-blue-800">
                        <CalendarCheck size={18} className="inline-block mr-1" />
                        {formatDateAvecJour(dispo.date)}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <Clock size={16} className="inline-block mr-1" />
                        {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservationsActives.find(resv =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation === heure
                          );

                          const estReserve = reservationsActives.some(resv =>
                            ['EN_ATTENTE', 'EN_ATTENTE_PAIEMENT', 'PAYEE'].includes(resv.statut) &&
                            resv.heureConsultation === heure
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm shadow"
                              >
                                💳 Payer à {formatHeureAvecH(heure)}
                              </button>
                            );
                          } else if (estReserve) {
                            return (
                              <button
                                key={`indispo-${dispo.id}-${heure}-${i}`}
                                disabled
                                className="px-3 py-1 bg-gray-300 text-gray-500 rounded text-sm cursor-not-allowed"
                              >
                                {formatHeureAvecH(heure)} (occupé)
                              </button>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm shadow"
                              >
                                Réserver à {formatHeureAvecH(heure)}
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
