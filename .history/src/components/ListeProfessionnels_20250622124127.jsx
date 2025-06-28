// ListeProfessionnels.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './commun/header';
import PiedPage from './commun/PiedPage';
import PaymentForm from './utilisateur/PaymentForm';
import DisponibilitesModal from './utilisateur/DisponibilitesModal';
import ModalPortal from './ModalPortal';

const DUREE_CONSULTATION_MINUTES = 45;

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [error, setError] = useState('');
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
      const res = await axios.post('/api/reservations', reservation, { withCredentials: true });
      toast.success('Réservation enregistrée ! Attente de validation du professionnel.');
      if (selectedPro) fetchDisponibilites(selectedPro.id);
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
          </ModalPortal >
        )}
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
