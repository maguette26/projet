import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import PiedPage from './commun/PiedPage';
import Header from './commun/header';

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [error, setError] = useState('');
  const [loadingDispo, setLoadingDispo] = useState(false);
  const [reservingId, setReservingId] = useState(null);

  // Chargement des professionnels
  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const res = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des professionnels.");
      }
    };
    fetchProfessionnels();
  }, []);

  // Chargement des disponibilités d'un professionnel
  const fetchDisponibilites = async (proId) => {
    try {
      setLoadingDispo(true);
      setSelectedPro(professionnels.find(p => p.id === proId));
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`/api/disponibilites/filtrees/${proId}?date=${today}`, {
        withCredentials: true,
      });
      setDisponibilites(res.data);
    } catch (err) {
      console.error("Erreur fetch disponibilites", err);
      toast.error("Erreur lors du chargement des disponibilités.");
    } finally {
      setLoadingDispo(false);
    }
  };

  // Réservation d'une disponibilité
  const reserverDisponibilite = async (dispo) => {
    if (!dispo.professionnelId) {
      toast.error("Identifiant du professionnel manquant.");
      return;
    }

    try {
      setReservingId(dispo.id);
      await axios.post('/api/reservations', dispo, { withCredentials: true });
      toast.success("Réservation réussie !");
      fetchDisponibilites(dispo.professionnelId);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la réservation.");
    } finally {
      setReservingId(null);
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

        {selectedPro && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Disponibilités pour {selectedPro.prenom} {selectedPro.nom}
            </h3>

            {loadingDispo ? (
              <p className="text-gray-500 text-center">Chargement...</p>
            ) : disponibilites.length === 0 ? (
              <p className="text-gray-600 text-center">Aucune disponibilité pour aujourd'hui.</p>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence>
                  {disponibilites.map((dispo) => (
                    <motion.li
                      key={dispo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border p-4 rounded-md shadow-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          <CalendarCheck size={16} className="inline-block mr-1" />
                          {new Date(dispo.date).toLocaleDateString()}
                        </p>
                        <p>
                          <Clock size={16} className="inline-block mr-1" />
                          {dispo.heureDebut?.substring(0, 5)} - {dispo.heureFin?.substring(0, 5)}
                        </p>
                      </div>
                      <button
                        disabled={reservingId === dispo.id}
                        onClick={() => reserverDisponibilite(dispo)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {reservingId === dispo.id ? "Réservation..." : "Réserver"}
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        )}
      </main>
      <PiedPage />
    </>
  );
};

export default ListeProfessionnels;
