import React from 'react';
import { CalendarCheck, Clock, Stethoscope, X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '../ModalPortal';

import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { setHours, setMinutes } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => 1,
  getDay,
  locales,
});

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

  const events = disponibilites.flatMap((dispo) => {
    const sousCreneaux = genererSousCreneaux(dispo);
    return sousCreneaux.map((heure) => {
      const [h, m] = heure.split(':').map(Number);
      const dateObj = new Date(dispo.date);
      const start = setMinutes(setHours(dateObj, h), m);
      const end = new Date(start.getTime() + 45 * 60000);

      const resv = dispo.reservations || [];
      const dejaReserve = resv.some(
        r => r.heureConsultation === heure && ['PAYEE', 'EN_ATTENTE'].includes(r.statut)
      );
      const enAttentePaiement = resv.find(
        r => r.heureConsultation === heure && r.statut === 'EN_ATTENTE_PAIEMENT' && r.statutValidation === 'VALIDE'
      );

      return {
        title: dejaReserve ? 'Réservé' : enAttentePaiement ? 'À payer' : 'Disponible',
        start,
        end,
        allDay: false,
        status: dejaReserve ? 'reserve' : enAttentePaiement ? 'paiement' : 'libre',
        dispo,
        heure,
        resvId: enAttentePaiement?.id,
      };
    });
  });

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
            className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6"
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

            <div className="flex items-center gap-3 mb-6 justify-center text-indigo-700 bg-white/70 backdrop-blur-sm rounded-md py-2 px-6 mx-auto max-w-max shadow-sm">
              <Stethoscope size={34} />
              <h2 className="text-3xl font-semibold text-gray-900 whitespace-nowrap">
                Créneaux du Dr {pro?.nom || ''}
              </h2>
            </div>

            {events.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">Aucune disponibilité trouvée.</p>
            ) : (
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={['week', 'day']}
                style={{ height: '75vh' }}
                messages={{
                  today: 'Aujourd’hui',
                  previous: 'Précédent',
                  next: 'Suivant',
                  week: 'Semaine',
                  day: 'Jour',
                  agenda: 'Agenda',
                  date: 'Date',
                  time: 'Heure',
                  event: 'Événement',
                }}
                eventPropGetter={(event) => {
                  let bg = '#4F46E5'; // disponible
                  if (event.status === 'reserve') bg = '#d1d5db'; // gris
                  else if (event.status === 'paiement') bg = '#facc15'; // jaune

                  return {
                    style: {
                      backgroundColor: bg,
                      color: '#000',
                      borderRadius: '6px',
                      padding: '4px',
                      fontWeight: '500',
                    },
                  };
                }}
                onSelectEvent={(event) => {
                  if (event.status === 'libre') onReserver(event.dispo, event.heure);
                  else if (event.status === 'paiement') onPayer(event.resvId);
                }}
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default DisponibilitesModal;
