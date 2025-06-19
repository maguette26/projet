import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import PiedPage from './commun/PiedPage';
import Header from './commun/header';

import PaymentForm from '<div className="" />
<components />
<utilisateur />PaymentForm'; // adapte le chemin si besoin

const DUREE_CONSULTATION_MINUTES = 45;

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [error, setError] = useState('');

  // Pour afficher le formulaire de paiement
  const [reservationIdPourPaiement, setReservationIdPourPaiement] = useState(null);

  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const res = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les professionnels.");
      }
    };
    fetchProfessionnels();
  }, []);

  const fetchDisponibilites = async (proId) => {
    try {
      setSelectedPro(null);
      setDisponibilites([]);
      setDisponibilitesVisibles(false);

      const res = await axios.get(`/api/disponibilites/${proId}`, {
        withCredentials: true,
      });

      setDisponibilites(res.data);
      const pro = professionnels.find(p => p.id === proId) || null;
      setSelectedPro(pro);
      setDisponibilitesVisibles(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des disponibilités.");
    }
  };

  const genererSousCreneaux = (dispo) => {
    const sousCreneaux = [];

    const [hStart, mStart] = dispo.heureDebut.split(':').map(Number);
    const [hEnd, mEnd] = dispo.heureFin.split(':').map(Number);

    const dateDispo = new Date(dispo.date);
    const debut = new Date(dateDispo);
    debut.setHours(hStart, mStart, 0, 0);

    const fin = new Date(dateDispo);
    fin.setHours(hEnd, mEnd, 0, 0);

    const maintenant = new Date();
    const duree = DUREE_CONSULTATION_MINUTES * 60 * 1000;

    const heuresReservees = dispo.reservations?.map(r => r.heureConsultation?.substring(0, 5)) || [];

    while (debut.getTime() + duree <= fin.getTime()) {
      const heureStr = debut.toTimeString().slice(0, 5);
      const creneauDateTime = new Date(debut);

      if (!heuresReservees.includes(heureStr) && creneauDateTime > maintenant) {
        sousCreneaux.push(heureStr);
      }

      debut.setTime(debut.getTime() + duree);
    }

    return sousCreneaux;
  };

  const reserverCreneau = async (dispo, heureConsultation) => {
    if (!dispo?.id) {
      toast.error("ID de la disponibilité introuvable.");
      return;
    }

    const heureFormatee = `${heureConsultation}:00`;

    const reservation = {
      disponibilite: { id: dispo.id },
      heureReservation: heureFormatee,
      heureConsultation: heureFormatee,
    };

    try {
      // On suppose que le backend renvoie la réservation créée avec son ID
      const res = await axios.post('/api/reservations', reservation, { withCredentials: true });
      toast.success('Réservation enregistrée !');

      const reservationCreee = res.data;
      // Ouvre le formulaire de paiement avec cet ID de réservation
      setReservationIdPourPaiement(reservationCreee.id);

      if (selectedPro) {
        fetchDisponibilites(selectedPro.id);
      }
    } catch (error) {
      if (error.response) {
        console.error('Erreur serveur:', error.response.data);
        toast.error(`Erreur : ${error.response.data.message || 'Réservation échouée'}`);
      } else {
        console.error('Erreur axios:', error.message);
        toast.error('Erreur réseau');
      }
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <main className="max-w-5xl mx-auto px-4 py-8 min-h-[80vh]">
        <h2 className="text-3xl font-bold text-center mb-6">Liste des professionnels</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <ul className="space-y-4">
          {professionnels.map((pro) => (
            <li key={pro.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold">{pro.prenom} {pro.nom}</p>
                <p className="text-gray-600">Spécialité : {pro.specialite}</p>
              </div>
              <button
                onClick={() => fetchDisponibilites(pro.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Voir Disponibilités
              </button>
            </li>
          ))}
        </ul>

        {disponibilitesVisibles && selectedPro && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Créneaux disponibles pour {selectedPro.prenom} {selectedPro.nom}
            </h3>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">
                Aucune disponibilité trouvée pour ce professionnel.
              </p>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence>
                  {disponibilites.map((dispo, idx) => {
                    const sousCreneaux = genererSousCreneaux(dispo);
                    if (sousCreneaux.length === 0) return null;

                    return (
                      <motion.li
                        key={`${dispo.date}-${dispo.heureDebut}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="border p-4 rounded-md shadow-md"
                      >
                        <p className="font-medium mb-2">
                          <CalendarCheck size={16} className="inline-block mr-1" />
                          {new Date(dispo.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <Clock size={16} className="inline-block mr-1" />
                          {dispo.heureDebut?.substring(0, 5)} - {dispo.heureFin?.substring(0, 5)}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {sousCreneaux.map((heure, i) => (
                            <button
                              key={i}
                              onClick={() => reserverCreneau(dispo, heure)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Réserver à {heure}
                            </button>
                          ))}
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        )}

        {/* Formulaire paiement modal */}
        {reservationIdPourPaiement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <PaymentForm
              reservationId={reservationIdPourPaiement}
              onClose={() => setReservationIdPourPaiement(null)}
            />
          </div>
        )}
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
