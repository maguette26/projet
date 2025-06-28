import React from 'react';
import { CalendarCheck, Clock, Stethoscope, X, CreditCard, Lock } from 'lucide-react';
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

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-100 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-md max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* En-tête avec icône et titre sur la même ligne */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Stethoscope size={28} className="text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Créneaux du docteur {pro?.prenom || '...'} {pro?.nom || ''}
              </h3>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="ml-6 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                <X size={28} />
              </button>
            </div>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-4">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border p-4 rounded-md shadow-md">
                      <p className="font-medium mb-2 flex items-center gap-2 text-indigo-600">
                        <CalendarCheck size={18} />
                        {new Date(dispo.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservationsActives.find(resv =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation === heure
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                              >
                                <CreditCard size={16} />
                                Payer à {formatHeureAvecH(heure)}
                              </button>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                              >
                                <Lock size={16} />
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
