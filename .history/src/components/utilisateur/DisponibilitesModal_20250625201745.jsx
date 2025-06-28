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

  // convertit "HH:MM:SS" en minutes depuis minuit
  const heureEnMinutes = (heureStr) => {
    if (!heureStr) return 0;
    const [h, m] = heureStr.split(':').map(Number);
    return h * 60 + m;
  };

  const genererSousCreneaux = (dispo, dureeMinutes = 45) => {
    const sousCreneaux = [];
    if (!dispo.heureDebut || !dispo.heureFin) return sousCreneaux;

    const debut = heureEnMinutes(dispo.heureDebut);
    const fin = heureEnMinutes(dispo.heureFin);

    for (let t = debut; t + dureeMinutes <= fin; t += dureeMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      sousCreneaux.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
    }

    return sousCreneaux;
  };

  // Timeline: 8h -> 20h (modifiable)
  const timelineStart = 8 * 60;  // 8h en minutes
  const timelineEnd = 20 * 60;   // 20h en minutes
  const timelineWidthPx = 700; // largeur fixe du timeline (ajustable)
  const timelineDuration = timelineEnd - timelineStart; // minutes

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
            className="relative bg-white rounded-xl shadow-lg max-w-[750px] w-full max-h-[85vh] overflow-y-auto p-6"
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

                // timeline ticks (heures)
                const timelineTicks = [];
                for (let t = timelineStart; t <= timelineEnd; t += 60) {
                  const h = Math.floor(t / 60);
                  timelineTicks.push(`${h}h`);
                }

                return (
                  <section key={`${dispo.date}-${idx}`} className="mb-10">
                    <div className="flex items-center mb-3 gap-3 border-b border-indigo-200 pb-2">
                      <CalendarCheck size={22} className="text-indigo-700" />
                      <h3 className="text-xl font-semibold capitalize">{dateLocale}</h3>
                    </div>

                    {/* Timeline heure (ligne horizontale avec ticks) */}
                    <div
                      className="relative h-10 border-b border-indigo-300 mb-4 select-none"
                      style={{ width: timelineWidthPx }}
                    >
                      {timelineTicks.map((tick, i) => {
                        const leftPercent = (i / (timelineTicks.length - 1)) * 100;
                        return (
                          <div
                            key={tick}
                            style={{ left: `${leftPercent}%` }}
                            className="absolute top-0 -translate-x-1/2 text-xs text-indigo-700"
                          >
                            {tick}
                          </div>
                        );
                      })}
                    </div>

                    {/* Créneaux positionnés horizontalement sur la timeline */}
                    <div
                      className="relative h-12"
                      style={{ width: timelineWidthPx }}
                    >
                      {sousCreneaux.map((heure, i) => {
                        const resvAPayer = reservationsActives.find(
                          (resv) =>
                            resv.statut === 'EN_ATTENTE_PAIEMENT' &&
                            resv.statutValidation === 'VALIDE' &&
                            resv.heureConsultation === heure
                        );
                        const estReserve = reservationsActives.some(
                          (resv) =>
                            (resv.statut === 'PAYEE' || resv.statut === 'EN_ATTENTE') &&
                            resv.heureConsultation === heure
                        );

                        let bgColor = 'bg-indigo-600 hover:bg-indigo-700 text-white';
                        let icon = <CheckCircle size={20} />;
                        let onClickHandler = () => onReserver(dispo, heure);
                        let disabled = false;
                        let title = 'Réserver ce créneau';

                        if (resvAPayer) {
                          bgColor = 'bg-yellow-400 hover:bg-yellow-500 text-white';
                          icon = <CreditCard size={20} />;
                          onClickHandler = () => onPayer(resvAPayer.id);
                          title = 'Réservation en attente de paiement';
                        } else if (estReserve) {
                          bgColor = 'bg-gray-300 text-gray-500 cursor-not-allowed';
                          icon = <Lock size={20} />;
                          disabled = true;
                          title = 'Créneau déjà réservé';
                        }

                        // Calcul position horizontale selon heure
                        const minutes = heureEnMinutes(heure);
                        const leftPx = ((minutes - timelineStart) / timelineDuration) * timelineWidthPx;

                        return (
                          <button
                            key={`creneau-${dispo.id}-${heure}-${i}`}
                            onClick={onClickHandler}
                            disabled={disabled}
                            title={title}
                            className={`${bgColor} flex items-center gap-2 py-2 px-3 rounded-lg shadow-md absolute top-0 transform -translate-x-1/2`}
                            style={{ left: leftPx, minWidth: 90 }}
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
                              {icon}
                            </div>
                            <span className="text-sm font-medium">{formatHeureAvecH(heure)}</span>
                          </button>
                        );
                      })}
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
