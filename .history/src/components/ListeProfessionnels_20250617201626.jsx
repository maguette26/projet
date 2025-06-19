import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarCheck, Clock, User, Euro } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const ListeProfessionnels = () => {
  const [professionnels, setProfessionnels] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loadingDispo, setLoadingDispo] = useState(false);
  const [error, setError] = useState('');

  // Chargement de la liste des professionnels
  useEffect(() => {
    const fetchProfessionnels = async () => {
      try {
        const response = await axios.get('/api/professionnels/tous', {
          withCredentials: true,
        });
        setProfessionnels(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des professionnels.');
      }
    };
    fetchProfessionnels();
  }, []);

  // Chargement des disponibilités pour un professionnel donné (pour aujourd'hui)
  const fetchDisponibilites = async (proId) => {
    setLoadingDispo(true);
    try {
      // On utilise la date du jour au format ISO (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/disponibilites/filtrees/${proId}?date=${today}`, {
        withCredentials: true,
      });
      setDisponibilites(response.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des disponibilités.");
    } finally {
      setLoadingDispo(false);
    }
  };

  // Fonction pour réserver une disponibilité
  const reserverDisponibilite = async (dispo) => {
    try {
      // Appel à ton endpoint de réservation (à adapter selon ton API réelle)
      const response = await axios.post('/api/reservations', dispo, {
        withCredentials: true,
      });
      toast.success("Réservation effectuée !");
      // Optionnel : rafraîchir la liste des disponibilités après réservation
      fetchDisponibilites(dispo.professionnelId);
    } catch (err) {
      toast.error("Erreur lors de la réservation.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" />
      {error && <p className="text-red-600">{error}</p>}

      {/* Liste des professionnels */}
      <h2 className="text-3xl font-bold mb-4">Liste des professionnels</h2>
      <ul className="space-y-4">
        {professionnels.map((pro) => (
          <li key={pro.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">
                {pro.prenom} {pro.nom}
              </p>
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

      {/* Afficher les disponibilités pour le professionnel sélectionné */}
      {selectedPro && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">
            Disponibilités pour {selectedPro.prenom} {selectedPro.nom}
          </h3>
          {loadingDispo ? (
            <p>Chargement des disponibilités...</p>
          ) : disponibilites.length === 0 ? (
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
    </div>
  );
};

export default ListeProfessionnels;
