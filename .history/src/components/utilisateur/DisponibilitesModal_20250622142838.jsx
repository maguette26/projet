import React from 'react';
import { CalendarCheck, Clock, Stethoscope, X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, onReserver, onPayer, onClose }) => {

  // Fonction pour formater une heure "HH:mm:ss" en "HHhmm"
  const formatHeureAvecH = (heureStr) => {
    if (!heureStr) return '';
    const [heures, minutes] = heureStr.split(':');
    return `${heures}h${minutes}`;
  };

  // Fonction générant les sous-créneaux au format HH:mm:ss (ex: "10:00:00")
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
            className="relative bg-white p-8 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-8 justify-center text-indigo-700 select-none">
              <Stethoscope size={34} />
              <h2 className="text-3xl font-semibold text-gray-900">
                Créneaux du docteur {pro?.prenom || '...'} {pro?.nom || ''}
              </h2>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="ml-6 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                <X size={28} />
              </button>
            </div>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center text-lg font-medium">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-6">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-4 mb-3 text-indigo-600 font-semibold">
                        <CalendarCheck size={20} />
                        <span>{new Date(dispo.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-gray-700 text-sm font-medium">
                        <Clock size={18} />
                        <span>{formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}</span>
                      </div>

                      <div className="flex flex-wrap gap-3">
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
                                className="flex items-center gap-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md text-sm font-semibold transition-colors"
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
                                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md text-sm font-semibold transition-colors"
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
