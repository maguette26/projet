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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm bg-white/40 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-8 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>

            {/* Titre centré */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2 text-blue-700 text-lg font-medium mb-1">
                <User size={20} />
                <span>Créneaux disponibles</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                pour {pro?.prenom} {pro?.nom}
              </h2>
            </div>

            {/* Disponibilités */}
            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
            ) : (
              <ul className="space-y-6">
                {disponibilites.map((dispo, idx) => {
                  const sousCreneaux = genererSousCreneaux(dispo);
                  const reservationsActives = dispo.reservations || [];

                  if (sousCreneaux.length === 0) return null;

                  return (
                    <li key={`${dispo.date}-${idx}`} className="border rounded-xl p-5 bg-gray-50">
                      {/* Date + horaires */}
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="flex items-center gap-2 text-blue-600 font-medium text-base">
                          <CalendarCheck size={18} />
                          <span>{formatDateComplete(dispo.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-700 text-sm">
                          <Clock size={16} />
                          <span>
                            {formatHeureAvecH(dispo.heureDebut)} - {formatHeureAvecH(dispo.heureFin)}
                          </span>
                        </div>
                      </div>

                      {/* Créneaux horaires */}
                      <div className="flex flex-wrap gap-3 justify-center mt-2">
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
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm shadow"
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
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm shadow"
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
