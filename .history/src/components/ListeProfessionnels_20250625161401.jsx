// ListeProfessionnels.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { CalendarSearch, Stethoscope } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

import Header from './commun/header';
import PiedPage from './commun/PiedPage';
import PaymentForm from './utilisateur/PaymentForm';
import DisponibilitesModal from './utilisateur/DisponibilitesModal';
import ModalPortal from './ModalPortal';

const DUREE_CONSULTATION_MINUTES = 45;

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [filteredPros, setFilteredPros] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [reservationIdPourPaiement, setReservationIdPourPaiement] = useState(null);
  const [selectedSpecialite, setSelectedSpecialite] = useState('Toutes');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const res = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(res.data);
        setFilteredPros(res.data);
        setSpecialites(['Toutes', ...new Set(res.data.map(p => p.specialite))]);
        setError('');
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les professionnels.");
      }
    };
    fetchProfessionnels();
  }, []);

  useEffect(() => {
    const filtered = professionnels.filter(pro =>
      selectedSpecialite === 'Toutes' || pro.specialite === selectedSpecialite
    );
    setFilteredPros(filtered);
  }, [selectedSpecialite, professionnels]);

  const fetchDisponibilites = async (proId) => {
    try {
      const res = await axios.get(`/api/disponibilites/${proId}`, { withCredentials: true });
      const pro = professionnels.find(p => p.id === proId) || null;
      setSelectedPro(pro);
      setDisponibilites(res.data);
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
    const heureFormatee = `${heureConsultation}:00`;
    const reservation = {
      disponibilite: { id: dispo.id },
      heureReservation: heureFormatee,
      heureConsultation: heureFormatee,
    };

    try {
      const res = await axios.post('/api/reservations', reservation, { withCredentials: true });
      toast.success('Réservation enregistrée ! En attente de validation.');
      if (selectedPro) fetchDisponibilites(selectedPro.id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur lors de la réservation");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <main className="max-w-7xl mx-auto px-6 py-8 min-h-[80vh]">
        <h2 className="text-3xl font-bold text-center mb-6">👩‍⚕️ Nos professionnels à votre écoute</h2>
        <p className="text-center text-gray-600 mb-8">Choisissez la spécialité adaptée à vos besoins.</p>

        {/* Filtre spécialité */}
        <div className="flex justify-center mb-8">
          <select
            className="border border-gray-300 rounded-md px-4 py-2"
            onChange={(e) => setSelectedSpecialite(e.target.value)}
            value={selectedSpecialite}
          >
            {specialites.map(spe => (
              <option key={spe} value={spe}>{spe}</option>
            ))}
          </select>
        </div>

        {/* Liste des professionnels */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {pro.prenom[0]}{pro.nom[0]}
                </div>
                <div>
                  <p className="text-lg font-semibold">{pro.prenom} {pro.nom}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Stethoscope className="w-4 h-4" /> {pro.specialite}</p>
                </div>
              </div>
              <button
                onClick={() => fetchDisponibilites(pro.id)}
                className="w-full mt-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <CalendarSearch className="w-4 h-4" /> Voir les créneaux
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modals */}
        {disponibilitesVisibles && selectedPro && (
          <DisponibilitesModal
            key={`modal-pro-${selectedPro.id}`}
            pro={selectedPro}
            disponibilites={disponibilites}
            genererSousCreneaux={genererSousCreneaux}
            onReserver={reserverCreneau}
            onPayer={setReservationIdPourPaiement}
            onClose={() => setDisponibilitesVisibles(false)}
          />
        )}

        {reservationIdPourPaiement && (
          <ModalPortal>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={() => setReservationIdPourPaiement(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="p-6 bg-white rounded shadow-lg max-w-md w-full max-h-screen overflow-auto"
              >
                <PaymentForm
                  reservationId={reservationIdPourPaiement}
                  onClose={() => setReservationIdPourPaiement(null)}
                />
              </div>
            </div>
          </ModalPortal>
        )}
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
