import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  HeartPulse,
  Stethoscope,
  ArrowRightCircle,
  ArrowLeftCircle,
  Filter,
  CalendarDays,
  User,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import Header from './commun/header';
import PiedPage from './commun/PiedPage';
import PaymentForm from './utilisateur/PaymentForm';
import DisponibilitesModal from './utilisateur/DisponibilitesModal';
import ModalPortal from './ModalPortal';

const ListeProfessionnels = () => {
  const [step, setStep] = useState(1);
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesVisibles, setDisponibilitesVisibles] = useState(false);
  const [specialites, setSpecialites] = useState([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState('all');
  const [reservationIdPourPaiement, setReservationIdPourPaiement] = useState(null);

  const fadeVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    axios.get('/api/professionnels/tous', { withCredentials: true }).then(res => {
      setProfessionnels(res.data);
      setSpecialites([...new Set(res.data.map(p => p.specialite))]);
    }).catch(() => toast.error("Erreur lors du chargement des professionnels."));
  }, []);

  const professionnelsFiltres = selectedSpecialite === 'all'
    ? professionnels
    : professionnels.filter(p => p.specialite === selectedSpecialite);

  return (
    <>
      <Header />
      <ToastContainer />
      <main className="min-h-screen px-6 py-10 font-[Poppins]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="intro"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center flex flex-col justify-center items-center min-h-[80vh]"
            >
              <h1 className="text-5xl font-extrabold text-indigo-800 mb-4">Bienvenue sur <span className="text-indigo-600">PsyConnect</span></h1>
              <p className="text-indigo-700 text-lg max-w-xl mb-10">
                Trouvez facilement des professionnels de santé mentale qualifiés, disponibles pour vous accompagner.
              </p>

              <div className="grid md:grid-cols-2 gap-8 text-left mb-10 max-w-4xl w-full">
                <div className="flex gap-4">
                  <HeartPulse className="w-10 h-10 text-indigo-500" />
                  <div>
                    <h3 className="text-2xl font-semibold">Psychologues</h3>
                    <p>Spécialistes de l’écoute thérapeutique pour vous aider à surmonter vos défis.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Stethoscope className="w-10 h-10 text-indigo-500" />
                  <div>
                    <h3 className="text-2xl font-semibold">Psychiatres</h3>
                    <p>Médecins experts pouvant poser un diagnostic et prescrire des traitements.</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-700 text-white py-2 px-6 rounded-full font-semibold flex items-center gap-2 hover:bg-indigo-800 shadow-md transition"
              >
                Découvrir les professionnels
                <ArrowRightCircle className="w-5 h-5" />
              </motion.button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="list"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-800">Nos professionnels</h2>
                <div className="flex items-center gap-2">
                  <Filter className="text-indigo-600" />
                  <select
                    value={selectedSpecialite}
                    onChange={(e) => setSelectedSpecialite(e.target.value)}
                    className="border rounded px-3 py-1 text-indigo-700"
                  >
                    <option value="all">Toutes les spécialités</option>
                    {specialites.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionnelsFiltres.map(pro => (
                  <div key={pro.id} className="border rounded-lg p-4 shadow hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      {pro.specialite?.toLowerCase().includes("psychiatre") ? (
                        <Stethoscope className="text-indigo-600" />
                      ) : (
                        <UserCheck className="text-indigo-600" />
                      )}
                      <h3 className="font-semibold text-lg">Dr. {pro.prenom} {pro.nom}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Spécialité : <strong>{pro.specialite}</strong></p>
                    <button
                      onClick={() => alert("Voir disponibilités...")}
                      className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
                    >
                      <CalendarDays className="inline-block w-4 h-4 mr-2" />
                      Voir disponibilités
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
                >
                  <ArrowLeftCircle className="w-5 h-5" /> Retour à l’intro
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
