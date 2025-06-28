import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  UserCheck,
  CalendarDays,
  Filter,
  HeartPulse,
  Stethoscope,
  User,
  ArrowRightCircle,
  ArrowLeftCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import Header from './commun/header';
import PiedPage from './commun/PiedPage';
import PaymentForm from './utilisateur/PaymentForm';
import DisponibilitesModal from './utilisateur/DisponibilitesModal';
import ModalPortal from './ModalPortal';

const DUREE_CONSULTATION_MINUTES = 45;

const ListeProfessionnels = () => {
  const [step, setStep] = useState(1); // 1 = intro, 2 = liste
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [error, setError] = useState('');
  const [reservationIdPourPaiement, setReservationIdPourPaiement] = useState(null);

  const [specialites, setSpecialites] = useState([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState('all');

  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const res = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(res.data);
        setError('');

        const specs = Array.from(new Set(res.data.map(p => p.specialite))).sort();
        setSpecialites(specs);
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
      const res = await axios.post('/api/reservations', reservation, { withCredentials: true });
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

  const professionnelsFiltres = selectedSpecialite === 'all'
    ? professionnels
    : professionnels.filter(pro => pro.specialite === selectedSpecialite);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  // Icône selon spécialité
  const iconSpecialite = (specialite) => {
    if (!specialite) return <UserCheck className="w-7 h-7 text-indigo-500" />;
    const s = specialite.toLowerCase();
    if (s.includes('psychiatre')) return <Stethoscope className="w-7 h-7 text-indigo-500" />;
    if (s.includes('psychologue')) return <UserMedical className="w-7 h-7 text-indigo-500" />;
    return <UserCheck className="w-7 h-7 text-indigo-500" />;
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <main className="max-w-6xl mx-auto px-6 py-12 min-h-[80vh]">

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="intro"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-4xl mx-auto text-center px-6"
            >
              <h2 className="text-4xl font-extrabold text-indigo-800 mb-8 leading-snug">
                Bienvenue sur <span className="text-indigo-600">PsyConnect</span> — votre passerelle vers des professionnels de santé mentale qualifiés
              </h2>
              <p className="text-gray-800 text-lg mb-8">
                Notre plateforme vous met en relation avec des <strong>psychologues</strong> et <strong>psychiatres</strong> certifiés, pour un accompagnement personnalisé adapté à vos besoins.
              </p>

              <div className="space-y-8 max-w-3xl mx-auto text-left text-gray-700 text-base">
                <div className="flex items-start gap-4">
                  <HeartPulse className="text-indigo-600 w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Psychologues</h3>
                    <p>
                      Les psychologues sont des professionnels formés à l’écoute, au soutien émotionnel et à l’accompagnement par la parole. Ils vous aident à surmonter vos difficultés psychologiques à travers des thérapies adaptées (cognitivo-comportementales, humanistes, etc.). Ils ne prescrivent pas de médicaments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Stethoscope className="text-indigo-600 w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Psychiatres</h3>
                    <p>
                      Les psychiatres sont des médecins spécialisés en santé mentale. Ils peuvent établir un diagnostic médical, prescrire des traitements médicamenteux et proposer des thérapies adaptées. Ils interviennent généralement dans les cas nécessitant un suivi médical plus approfondi.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-12 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold inline-flex items-center gap-3 shadow-lg transition-transform active:scale-95"
                aria-label="Accéder à la liste des professionnels"
              >
                Découvrir les professionnels
                <ArrowRightCircle className="w-6 h-6" />
              </button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="liste"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className=""
            >
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 gap-6">
                <h2 className="text-4xl font-extrabold text-indigo-800">
                  Nos professionnels certifiés
                </h2>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                    aria-label="Retour à l’introduction"
                  >
                    <ArrowLeftCircle className="w-6 h-6" />
                    Retour à l’intro
                  </button>

                  <div className="flex items-center gap-3 bg-indigo-50 rounded-md px-4 py-2 border border-indigo-200 shadow-sm">
                    <Filter className="text-indigo-600 w-6 h-6" />
                    <select
                      value={selectedSpecialite}
                      onChange={(e) => setSelectedSpecialite(e.target.value)}
                      className="appearance-none bg-transparent border-none focus:ring-0 text-indigo-700 font-semibold cursor-pointer"
                      aria-label="Filtrer par spécialité"
                    >
                      <option value="all">Toutes les spécialités</option>
                      {specialites.map((spec, idx) => (
                        <option key={idx} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-600 text-center mb-4">{error}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {professionnelsFiltres.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600 italic">
                    Aucun professionnel ne correspond à cette spécialité.
                  </p>
                ) : (
                  professionnelsFiltres.map((pro) => (
                    <div
                      key={pro.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          {iconSpecialite(pro.specialite)}
                          <h3 className="text-xl font-semibold text-gray-900 select-text">
                            Docteur {pro.prenom} {pro.nom}
                          </h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-6 font-medium tracking-wide">
                          Spécialité : <span className="font-semibold text-indigo-700">{pro.specialite}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => fetchDisponibilites(pro.id)}
                        className="mt-auto px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-3 font-semibold transition-shadow shadow-md active:scale-95"
                      >
                        <CalendarDays className="w-5 h-5" />
                        Voir Disponibilités
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

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
