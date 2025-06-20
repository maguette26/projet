// ✅ ListeProfessionnels.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './commun/header';
import PiedPage from './commun/PiedPage';
import PaymentForm from './utilisateur/PaymentForm';
import DisponibilitesModal from './utilisateur/DisponibilitesModal';

const DUREE_CONSULTATION_MINUTES = 45;

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [error, setError] = useState('');
  const [reservationIdPourPaiement, setReservationIdPourPaiement] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios.get('/api/professionnels/tous', { withCredentials: true })
      .then(res => setProfessionnels(res.data))
      .catch(() => setError("Impossible de charger les professionnels."));
  }, []);

  const fetchDisponibilites = async (proId) => {
    try {
      const res = await axios.get(`/api/disponibilites/${proId}`, { withCredentials: true });
      const pro = professionnels.find(p => p.id === proId) || null;
      setSelectedPro(pro);
      setDisponibilites(res.data);
      setDisponibilitesVisibles(true);
    } catch {
      toast.error("Erreur lors du chargement des disponibilités.");
    }
  };

  const openDisponibilites = (proId) => {
    fetchDisponibilites(proId);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchDisponibilites(proId), 30000);
  };

  const closeDisponibilites = () => {
    setDisponibilitesVisibles(false);
    setSelectedPro(null);
    setDisponibilites([]);
    clearInterval(intervalRef.current);
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
      if (!heuresReservees.includes(heureStr) && debut > maintenant) {
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
      await axios.post('/api/reservations', reservation, { withCredentials: true });
      toast.success('Réservation enregistrée !');
      if (selectedPro) fetchDisponibilites(selectedPro.id);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Erreur lors de la réservation');
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
            <li key={pro.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-xl font-semibold">{pro.prenom} {pro.nom}</p>
                <p className="text-gray-600">Spécialité : {pro.specialite}</p>
              </div>
              <button
                onClick={() => openDisponibilites(pro.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voir Disponibilités
              </button>
            </li>
          ))}
        </ul>

        {disponibilitesVisibles && selectedPro && (
          <DisponibilitesModal
            pro={selectedPro}
            disponibilites={disponibilites}
            genererSousCreneaux={genererSousCreneaux}
            onReserver={reserverCreneau}
            onPayer={setReservationIdPourPaiement}
            onClose={closeDisponibilites}
          />
        )}

        {reservationIdPourPaiement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <PaymentForm
              reservationId={reservationIdPourPaiement}
              onClose={() => setReservationIdPourPaiement(null)}
              refreshDisponibilites={() => fetchDisponibilites(selectedPro.id)}
            />
          </div>
        )}
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
