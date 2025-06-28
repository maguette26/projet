import React from 'react';
import { CalendarDays, Clock, XCircle } from 'lucide-react';

const DisponibilitesModal = ({
  pro,
  disponibilites,
  genererSousCreneaux,
  onReserver,
  onPayer,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
          Disponibilités de Dr. {pro.prenom} {pro.nom}
        </h2>

        {disponibilites.length === 0 ? (
          <p className="text-gray-600">Aucune disponibilité pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {disponibilites.map((dispo) => {
              const sousCreneaux = genererSousCreneaux(dispo); // ✅ version du parent

              return (
                <li key={dispo.id} className="border rounded-md p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                      <CalendarDays className="w-5 h-5" />
                      {new Date(dispo.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      {dispo.heureDebut} - {dispo.heureFin}
                    </div>
                  </div>

                  {sousCreneaux.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucun créneau disponible</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {sousCreneaux.map((heure) => (
                        <button
                          key={heure}
                          onClick={() => onReserver(dispo, heure)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
                        >
                          {heure}
                        </button>
                      ))}
                    </div>
                  )}
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
