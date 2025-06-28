import React from 'react';

const DisponibilitesModal = ({ pro, disponibilites, genererSousCreneaux, onReserver, onPayer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
          Disponibilités de Dr. {pro.prenom} {pro.nom}
        </h2>

        {disponibilites.length === 0 ? (
          <p className="text-gray-600">Aucune disponibilité pour le moment.</p>
        ) : (
          <ul className="space-y-6">
            {disponibilites.map((dispo) => {
              const sousCreneaux = genererSousCreneaux(dispo); // ✅ utilisation de la prop

              return (
                <li key={dispo.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">
                    {new Date(dispo.date).toLocaleDateString('fr-FR')} de {dispo.heureDebut} à {dispo.heureFin}
                  </p>
                  {sousCreneaux.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucun créneau disponible</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {sousCreneaux.map((heure) => (
                        <button
                          key={heure}
                          onClick={() => onReserver(dispo, heure)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
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
