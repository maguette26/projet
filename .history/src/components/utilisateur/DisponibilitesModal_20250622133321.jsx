import React from 'react';
import { CalendarCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, genererSousCreneaux, onReserver, onPayer, onClose }) => {
  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
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
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
            >
              ✖
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">
              Créneaux pour {pro?.prenom || '...'} {pro?.nom || ''}
            </h3>

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
                      <p className="font-medium mb-2">
                        <CalendarCheck size={16} className="inline-block mr-1" />
                        {new Date(dispo.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <Clock size={16} className="inline-block mr-1" />
                        {dispo.heureDebut?.substring(0, 5)} - {dispo.heureFin?.substring(0, 5)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {sousCreneaux.map((heure, i) => {
                          // Recherche d'une réservation à payer sur ce créneau
                          const resvAPayer = reservationsActives.find(resv =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation?.substring(0, 5) === heure
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                              >
                                Payer la réservation à {heure}
                              </button>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                Réserver à {heure}
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
