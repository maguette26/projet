// src/components/professionel/FormulaireDisponibilite.jsx
import React, { useState, useEffect } from 'react';

const FormulaireDisponibilite = ({ onSubmit, disponibiliteInitiale, onCancel }) => {
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');

  // Quand disponibiliteInitiale change (ex. passage en édition), on remplit le formulaire
  useEffect(() => {
    if (disponibiliteInitiale) {
      setDate(disponibiliteInitiale.date);
      setHeureDebut(disponibiliteInitiale.heureDebut);
      setHeureFin(disponibiliteInitiale.heureFin);
    } else {
      setDate('');
      setHeureDebut('');
      setHeureFin('');
    }
  }, [disponibiliteInitiale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Appelle la prop onSubmit avec les données du formulaire
    onSubmit({ date, heureDebut, heureFin });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date :</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700">Heure début :</label>
        <input
          type="time"
          id="heureDebut"
          value={heureDebut}
          onChange={e => setHeureDebut(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700">Heure fin :</label>
        <input
          type="time"
          id="heureFin"
          value={heureFin}
          onChange={e => setHeureFin(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {disponibiliteInitiale ? "Modifier" : "Ajouter"}
        </button>
        {disponibiliteInitiale && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default FormulaireDisponibilite;