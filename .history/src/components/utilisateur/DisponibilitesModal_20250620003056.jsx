import React from 'react';
import { CalendarCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DisponibilitesModal = ({ pro, disponibilites, genererSousCreneaux, onReserver, onPayer, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white p-6 rounded-md max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
            aria-label="Fermer la modale"
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
                const reservations = dispo.reservations || [];

                if (sousCreneaux.length === 0 && reservations.length === 0) return null;

                return (
                  <li key={`${dispo.date}-${idx}`} className="border p-4 rounded-md shadow-md">
                    <p className="font-medium mb-2 flex items-center gap-1">
                      <CalendarCheck size={16} />
                      {new Date(dispo.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                      <Clock size={16} />
                      {dispo.heureDebut?.substring(0, 5)} - {dispo.heureFin?.substring(0, 5)}
                    </p>

                    {/* Créneaux libres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {sousCreneaux.length > 0 ? (
                        sousCreneaux.map((heure, i) => (
                          <button
                            key={`libre-${i}`}
                            onClick={() => onReserver(dispo, heure)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Réserver à {heure}
                          </button>
                        ))
                      ) : (
                        <p className="text-gray-500 italic text-sm">Aucun créneau libre</p>
                      )}
                    </div>

                    {/* Affichage des réservations */}
                    <div className="flex flex-wrap gap-2">
                      {reservations.map((resv) => {
                        switch (resv.statut) {
                          case 'EN_ATTENTE':
                            return (
                              <span key={resv.id} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
                                Réservation en attente
                              </span>
                            );
                          case 'VALIDE':
                            return (
                              <button
                                key={resv.id}
                                onClick={() => onPayer(resv.id)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                              >
                                Payer la réservation
                              </button>
                            );
                          case 'REFUSE':
                            return (
                              <span key={resv.id} className="px-3 py-1 bg-red-600 text-white rounded text-sm">
                                Réservation refusée
                              </span>
                            );
                          case 'PAYEE':
                            return (
                              <span key={resv.id} className="px-3 py-1 bg-green-700 text-white rounded text-sm">
                                Déjà payée
                              </span>
                            );
                          default:
                            return null;
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
  );
};

export default DisponibilitesModal;
