import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { UserCircle2, CalendarDays, Search } from 'lucide-react';
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
  const [selectedSpecialite, setSelectedSpecialite] = useState('all');

  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const res = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError("❌ Impossible de charger les professionnels.");
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
      await axios.post('/api/reservations', reservation, { withCredentials: true });
      toast.success('✅ Réservation enregistrée ! Attente de validation du professionnel.');
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

  const specialites = Array.from(new Set(professionnels.map(p => p.specialite))).sort();

  const filteredPro = professionnels
    .filter(p => selectedSpecialite === 'all' || p.specialite === selectedSpecialite)
    .sort((a, b) => a.nom.localeCompare(b.nom));

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <main className="max-w-6xl mx-auto px-4 py-10 min-h-[80vh]">
        <h2 className="text-4xl font-bold text-center mb-4 text-indigo-800">Nos professionnels certifiés</h2>
        <p className="text-center text-gray-600 mb-10">
          Trouvez un professionnel de confiance et prenez rendez-vous en toute simplicité.
        </p>

        {/* Filtres par spécialité */}
        <div className="mb-10 flex justify-center">
          <select
            value={selectedSpecialite}
            onChange={(e) => setSelectedSpecialite(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">Toutes les spécialités</option>
            {specialites.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Liste des professionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPro.map((pro) => (
            <div
              key={pro.id}
              className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle2 className="w-8 h-8 text-indigo-500" />
                  <h3 className="text-xl font-semibold text-gray-800">{pro.prenom} {pro.nom}</h3>
                </div>
                <p className="text-gray-600 mb-4">🧠 Spécialité : <strong>{pro.specialite}</strong></p>
              </div>
              <button
                onClick={() => fetchDisponibilites(pro.id)}
                className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Voir Disponibilités
              </button>
            </div>
          ))}

          {/* Message si aucun résultat */}
          {filteredPro.length === 0 && (
            <div className="col-span-full text-center py-8">
              <div className="text-xl font-semibold text-gray-600">
                😕 Aucun professionnel trouvé pour cette spécialité.
              </div>
              <p className="text-gray-500 mt-2">
                Veuillez sélectionner une autre spécialité ou réessayer plus tard.
              </p>
            </div>
          )}
        </div>

        {/* Modal Disponibilités */}
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

        {/* Modal Paiement */}
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
