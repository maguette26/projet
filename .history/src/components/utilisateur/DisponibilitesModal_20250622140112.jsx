import React from 'react';
import { CalendarCheck, Clock, X } from 'lucide-react';
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
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-8 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture flottant */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-600 hover:text-red-500 transition-colors"
              title="Fermer"
            >
              <X size={28} />
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
              Créneaux de {pro?.prenom} {pro?.nom}
            </h2>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
            ) : (
              <div className="space-y-8">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                  return (
                    <div
                      key={`${dispo.date}-${idx}`}
                      className="bg-blue-50 border-l-4 border-blue-300 p-6 rounded-xl shadow-sm"
                    >
                      <div className="mb-3">
                        <p className="text-lg font-semibold text-blue-800">
                          <CalendarCheck className="inline-block mr-2 text-blue-600" size={20} />
                          {new Date(dispo.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <Clock className="inline-block mr-2 text-blue-400" size={16} />
                          {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservationsActives.find(
                            (resv) =>
                              resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                              resv.statutValidation === 'VALIDE' &&
                              resv.heureConsultation === heure
                          );

                          const label = formatHeureAvecH(heure);

                          return resvAPayer ? (
                            <button
                              key={`payer-${resvAPayer.id}`}
                              onClick={() => onPayer(resvAPayer.id)}
                              className="px-4 py-2 rounded-full bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition"
                            >
                              💳 {label}
                            </button>
                          ) : (
                            <button
                              key={`libre-${dispo.id}-${heure}-${i}`}
                              onClick={() => onReserver(dispo, heure)}
                              className="px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default DisponibilitesModal;
