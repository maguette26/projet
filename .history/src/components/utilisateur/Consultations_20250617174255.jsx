import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateTime = (dateStr, heureStr) => {
  const date = new Date(dateStr + 'T' + heureStr);
  return date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
};

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axios.get('/api/consultations/mes-consultations', { withCredentials: true });
        setConsultations(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des consultations');
      }
    };
    fetchConsultations();
  }, []);

  const filteredConsultations = filtre
    ? consultations.filter(c => c.statut === filtre)
    : consultations;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.h2
        className="text-4xl font-extrabold text-indigo-700 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Mes Consultations
      </motion.h2>

      <div className="flex justify-end mb-4">
        <select
          className="border border-indigo-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="A_VENIR">À venir</option>
          <option value="TERMINEE">Terminées</option>
          <option value="ANNULEE">Annulées</option>
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredConsultations.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Aucune consultation trouvée.</p>
      ) : (
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-w-full bg-white shadow rounded"
        >
          <thead className="bg-indigo-100 text-indigo-700 text-left text-sm">
            <tr>
              <th className="px-6 py-3">Date & Heure</th>
              <th className="px-6 py-3">Professionnel</th>
              <th className="px-6 py-3">Prix</th>
              <th className="px-6 py-3">Durée</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            <AnimatePresence>
              {filteredConsultations.map(con => (
                <motion.tr
                  key={con.idConsultation}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hover:bg-indigo-50"
                >
                  <td className="px-6 py-4">{formatDateTime(con.dateConsultation, con.heure)}</td>
                  <td className="px-6 py-4">{con.professionnel ? `Dr. ${con.professionnel.prenom} ${con.professionnel.nom}` : 'N/A'}</td>
                  <td className="px-6 py-4">{con.prix} MAD</td>
                  <td className="px-6 py-4">{con.dureeMinutes} min</td>
                  <td className={`px-6 py-4 font-semibold ${
                    con.statut === 'ANNULEE' ? 'text-red-600' :
                    con.statut === 'TERMINEE' ? 'text-green-600' :
                    'text-indigo-600'
                  }`}>
                    {con.statut.replace('_', ' ')}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default Consultations;
