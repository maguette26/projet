import React from 'react';
import { CalendarDays, Clock, User2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, onReserver, onPayer, onClose }) => {

  const formatHeure = (heureStr) => {
    if (!heureStr) return '';
    const [h, m] = heureStr.split(':');
    return `${h}h${m}`;
  };

  const genererSousCreneaux = (dispo, dureeMinutes = 15) => {
    const slots = [];
    if (!dispo.heureDebut || !dispo.heureFin) return slots;

    const toMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const fromMin = (min) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    };

    const start = toMin(dispo.heureDebut);
    const end = toMin(dispo.heureFin);
    for (let t = start; t + dureeMinutes <= end; t += dureeMinutes) {
      slots.push(fromMin(t));
    }
    return slots;
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-8 border border-gray-200"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            {/* Titre */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2 text-blue-700 text-xl font-semibold">
                <User2 size={20} />
                <span>Créneaux pour {pro?.prenom} {pro?.nom}</span>
              </div>
            </div>

            {/* Liste des dispos */}
            {disponibilites.length === 0 ? (
              <p className="text-center text-gray-600">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-6">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservations = dispo.reservations || [];

                  if (sousCreneaux.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="bg-gray-50 rounded-xl p-5 border">
                      {/* Date */}
                      <div className="flex items-center justify-center gap-2 text-blue-600 font-medium mb-3 text-lg">
                        <CalendarDays size={18} />
                        {formatDate(dispo.date)}
                      </div>

                      {/* Heures */}
                      <div className="flex justify-center items-center text-sm text-gray-600 mb-4">
                        <Clock size={16} className="mr-1" />
                        {formatHeure(dispo.heureDebut)} - {formatHeure(dispo.heureFin)}
                      </div>

                      {/* Créneaux */}
                      <div className="flex flex-wrap gap-3 justify-center">
                        {sousCreneaux.map((heure, i) => {
                          const resvAPayer = reservations.find(resv =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation === heure
                          );

                          const dejaReserve = reservations.some(resv =>
                            resv.heureConsultation === heure &&
                            ['EN_ATTENTE', 'EN_ATTENTE_PAIEMENT', 'PAYEE'].includes(resv.statut)
                          );

                          if (resvAPayer) {
                            return (
                              <button
                                key={`payer-${resvAPayer.id}`}
                                onClick={() => onPayer(resvAPayer.id)}
                                className="px-4 py-1 text-sm rounded-full bg-yellow-500 text-white hover:bg-yellow-600 shadow"
                              >
                                {formatHeure(heure)} – Payer
                              </button>
                            );
                          } else if (dejaReserve) {
                            return (
                              <span
                                key={`occupe-${heure}-${i}`}
                                className="px-4 py-1 text-sm rounded-full bg-gray-300 text-gray-500 cursor-not-allowed"
                              >
                                {formatHeure(heure)} – Réservé
                              </span>
                            );
                          } else {
                            return (
                              <button
                                key={`libre-${dispo.id}-${heure}-${i}`}
                                onClick={() => onReserver(dispo, heure)}
                                className="px-4 py-1 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 shadow"
                              >
                                {formatHeure(heure)} – Réserver
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
