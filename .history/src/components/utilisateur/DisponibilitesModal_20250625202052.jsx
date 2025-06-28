import React from 'react';
import { CalendarCheck, Clock, Stethoscope, X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

const DisponibilitesModal = ({ pro, disponibilites, onReserver, onPayer, onClose, loading }) => {
  const formatHeureAvecH = (heureStr) => {
    if (!heureStr) return '';
    const [h, m] = heureStr.split(':');
    return `${h}h${m}`;
  };

  const genererSousCreneaux = (dispo, dureeMinutes = 45) => {
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

  // Générer la timeline d'heures de 8h à 20h (modifiable)
  const timelineHeures = [];
  for(let h = 8; h <= 20; h++) {
    timelineHeures.push(`${h.toString().padStart(2,'0')}:00:00`);
  }

  if (loading) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="animate-pulse p-8 rounded-lg shadow-lg bg-gray-100 text-gray-400 text-lg font-semibold">
            Chargement des disponibilités...
          </div>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex justify-center items-center z-50 bg-white/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key={`modal-${pro?.id ?? 'unknown'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 rounded hover:bg-indigo-100 transition"
              aria-label="Fermer"
              style={{ color: '#4F46E5' }}
            >
              <X size={28} />
            </button>

            <div className="flex items-center gap-3 mb-8 justify-center text-indigo-700 bg-white/70 backdrop-blur-sm rounded-md py-2 px-6 mx-auto max-w-max shadow-sm">
              <Stethoscope size={34} />
              <h2 className="text-3xl font-semibold text-gray-900 whitespace-nowrap">
                Créneaux du Dr {pro?.nom || ''}
              </h2>
            </div>

            {disponibilites.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">Aucune disponibilité trouvée.</p>
            ) : (
              disponibilites.map((dispo, idx) => {
                const sousCreneaux = genererSousCreneaux(dispo);
                const reservationsActives = dispo.reservations || [];

                if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

                const dateLocale = new Date(dispo.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                });

                // Pour faciliter recherche par heure, on mappe les réservations par heure
                const resvMap = {};
                reservationsActives.forEach((resv) => {
                  resvMap[resv.heureConsultation] = resv;
                });

                return (
                  <section key={`${dispo.date}-${idx}`} className="mb-12">
                    <div className="mb-4 flex items-center gap-2 text-indigo-700 font-semibold text-xl capitalize">
                      <CalendarCheck size={24} />
                      <span>{dateLocale}</span>
                    </div>

                    <div className="flex">
                      {/* Colonne timeline heures */}
                      <div className="flex flex-col text-gray-600 font-mono text-sm pr-4 select-none" style={{minWidth: '50px'}}>
                        {timelineHeures.map((heure) => (
                          <div key={heure} className="h-12 border-b border-gray-200 flex items-center">
                            {formatHeureAvecH(heure)}
                          </div>
                        ))}
                      </div>

                      {/* Colonne créneaux */}
                      <div className="flex-1">
                        {timelineHeures.map((heure) => {
                          // Le créneau dans sousCreneaux correspond à cette heure ? Sinon case vide
                          // On veut aussi afficher si c'est réservé etc.
                          const resv = resvMap[heure];
                          const estCreneauDispo = sousCreneaux.includes(heure);

                          if (!estCreneauDispo && !resv) {
                            // Pas de créneau à cette heure, on affiche case vide pour l'alignement
                            return (
                              <div key={heure} className="h-12 border-b border-gray-200"></div>
                            );
                          }

                          // Statut réservation
                          if (resv) {
                            if (resv.statut === 'EN_ATTENTE_PAIEMENT' && resv.statutValidation === 'VALIDE') {
                              return (
                                <button
                                  key={resv.id}
                                  onClick={() => onPayer(resv.id)}
                                  className="h-12 w-full mb-0.5 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold flex items-center justify-center"
                                  title="Réservation en attente de paiement"
                                >
                                  <CreditCard size={18} className="mr-1" /> {formatHeureAvecH(heure)}
                                </button>
                              );
                            } else if (resv.statut === 'PAYEE' || resv.statut === 'EN_ATTENTE') {
                              return (
                                <button
                                  key={resv.id}
                                  disabled
                                  className="h-12 w-full mb-0.5 rounded bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center select-none"
                                  title="Créneau déjà réservé"
                                >
                                  <Lock size={18} className="mr-1" /> {formatHeureAvecH(heure)}
                                </button>
                              );
                            }
                          }

                          // Sinon créneau libre
                          return (
                            <button
                              key={heure}
                              onClick={() => onReserver(dispo, heure)}
                              className="h-12 w-full mb-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center"
                              title="Réserver ce créneau"
                            >
                              <CheckCircle size={18} className="mr-1" /> {formatHeureAvecH(heure)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default DisponibilitesModal;
