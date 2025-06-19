import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/commun/Header'; // adapte le chemin si besoin
import Footer from '../components/commun/Footer'; // adapte aussi si besoin
import PiedPage from './commun/PiedPage';

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [error, setError] = useState('');

  // Charger les professionnels
  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const response = await axios.get('/api/professionnels/tous', { withCredentials: true });
        setProfessionnels(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des professionnels.');
      }
    };
    fetchProfessionnels();
  }, []);

  // Charger les disponibilités d’un pro
  const fetchDisponibilites = async (proId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/disponibilites/filtrees/${proId}?date=${today}`, {
        withCredentials: true,
      });
      setDisponibilites(response.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des disponibilités.");
    }
  };

  // Réserver
  const reserverDisponibilite = async (dispo) => {
    try {
      await axios.post('/api/reservations', dispo, { withCredentials: true });
      toast.success("Réservation effectuée !");
      fetchDisponibilites(dispo.professionnelId);
    } catch (err) {
      toast.error("Erreur lors de la réservation.");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <main className="max-w-5xl mx-auto px-4 py-8 min-h-[80vh]">
        <h2 className="text-3xl font-bold mb-4 text-center">Liste des professionnels</h2>

        {error && (
          <p className="text-red-600 text-center mb-6">
            {error}
          </p>
        )}

        <ul className="space-y-4">
          {professionnels.map((pro) => (
            <li key={pro.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold">{pro.prenom} {pro.nom}</p>
                <p className="text-gray-600">Spécialité : {pro.specialite}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPro(pro);
                  fetchDisponibilites(pro.id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md transition-colors hover:bg-blue-700"
              >
                Voir Disponibilités
              </button>
            </li>
          ))}
        </ul>

        {selectedPro && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">
              Disponibilités pour {selectedPro.prenom} {selectedPro.nom}
            </h3>

            {disponibilites.length === 0 ? (
              <p className="text-gray-600">Aucune disponibilité trouvée pour aujourd'hui.</p>
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
                      className="border p-4 rounded-md flex justify-between items-center shadow-sm"
                    >
                      <div>
                        <p className="font-medium">
                          <CalendarCheck size={16} className="inline-block mr-1" />
                          Date : {new Date(dispo.date).toLocaleDateString()}
                        </p>
                        <p>
                          <Clock size={16} className="inline-block mr-1" />
                          Début : {dispo.heureDebut?.substring(0, 5)} - Fin : {dispo.heureFin?.substring(0, 5)}
                        </p>
                      </div>
                      <button
                        onClick={() => reserverDisponibilite(dispo)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md transition-colors hover:bg-green-700"
                      >
                        Réserver
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        )}
      </main>
      <PiedPage/>
    </>
  );
};

export default ListeProfessionnels;
