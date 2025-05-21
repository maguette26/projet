import React, { useState } from 'react';
import { reserverConsultation } from '../../services/serviceUtilisateur';

const FormulaireConsultation = () => {
  const [dateHeure, setDateHeure] = useState('');
  const [typeConsultation, setTypeConsultation] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateHeure || !typeConsultation) {
      setMessage('Veuillez remplir les champs obligatoires.');
      return;
    }

    try {
      await reserverConsultation({ dateHeure, typeConsultation, commentaire });
      setMessage('Consultation réservée avec succès.');
      setDateHeure('');
      setTypeConsultation('');
      setCommentaire('');
    } catch (error) {
      setMessage('Erreur lors de la réservation.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Réserver une consultation</h2>
      
      <label>
        Date et heure* :
        <input
          type="datetime-local"
          value={dateHeure}
          onChange={e => setDateHeure(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Type de consultation* :
        <select value={typeConsultation} onChange={e => setTypeConsultation(e.target.value)} required>
          <option value="">-- Sélectionner --</option>
          <option value="psychologue">Psychologue</option>
          <option value="psychiatre">Psychiatre</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <br />

      <label>
        Commentaire :
        <textarea
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)}
          placeholder="Commentaires ou précisions"
        />
      </label>
      <br />

      <button type="submit">Réserver</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default FormulaireConsultation;
