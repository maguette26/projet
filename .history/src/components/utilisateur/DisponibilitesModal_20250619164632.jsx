// src/components/utilisateur/DisponibilitesModal.jsx
import React from 'react';
import { CalendarCheck, Clock } from 'lucide-react';

const DisponibilitesModal = ({ pro, disponibilites, genererSousCreneaux, onReserver, onPayer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Créneaux pour {pro.prenom} {pro.nom}
        </h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          ✖
        </button>

        {disponibilites.length === 0 ? (
          <p className="text-gray-600 text-center">Aucune disponibilité trouvée.</p>
        ) : (
          <ul className="space-y-4">
            {disponibilites.map((dispo, idx) => {
              const sousCreneaux = genererSousCreneaux(dispo);
              const reservationsActives = dispo.reservations || [];

              if (sousCreneaux.length === 0 && reservationsActives.length === 0) return null;

              return (
                <li key={`${dispo.date}-${idx}`} className="border p-4 rounded-md shadow-md">
                  <p className="font-medium mb-2">
                    <CalendarCheck size={16} className="inline-block mr-1" />
                    {new Date(dispo.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <Clock size={16} className="inline-block mr-1" />
                    {dispo.heureDebut?.substring(0, 5)} - {dispo.heureFin?.substring(0, 5)}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {sousCreneaux.map((heure, i) => (
                      <button
                        key={`libre-${i}`}
                        onClick={() => onReserver(dispo, heure)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Réserver à {heure}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {reservationsActives
                      .filter(resv => resv.statut === 'EN_ATTENTE_PAIEMENT')
                      .map((resv) => (
                        <button
                          key={`reserve-${resv.id}`}
                          onClick={() => onPayer(resv.id)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                        >
                          Payer la réservation
                        </button>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DisponibilitesModal;
