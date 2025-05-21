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
    onSubmit({ date, heureDebut, heureFin });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Date :</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <label>Heure début :</label>
      <input type="time" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} required />
      <label>Heure fin :</label>
      <input type="time" value={heureFin} onChange={e => setHeureFin(e.target.value)} required />

      <button type="submit">{disponibiliteInitiale ? "Modifier" : "Ajouter"}</button>
      {disponibiliteInitiale && <button type="button" onClick={onCancel}>Annuler</button>}
    </form>
  );
};

export default FormulaireDisponibilite;
