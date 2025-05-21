import React, { useEffect, useState } from 'react';
import { getSuiviHumeur, ajouterHumeur } from '../../services/serviceUtilisateur';

const SuiviHumeur = () => {
  const [humeurs, setHumeurs] = useState([]);
  const [nouvelleHumeur, setNouvelleHumeur] = useState('');
  const [message, setMessage] = useState('');

  // Charger les humeurs dès le chargement du composant
  useEffect(() => {
    const chargerHumeurs = async () => {
      try {
        const data = await getSuiviHumeur();
        setHumeurs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des humeurs :", error);
      }
    };
    chargerHumeurs();
  }, []);

  // Ajouter une humeur
  const handleAjout = async (e) => {
    e.preventDefault();
    if (!nouvelleHumeur.trim()) return;

    try {
      const data = await ajouterHumeur(nouvelleHumeur);
      setHumeurs((prev) => [...prev, data]);
      setMessage('Humeur ajoutée avec succès !');
      setNouvelleHumeur('');
    } catch (error) {
      console.error("Erreur lors de l’ajout :", error);
      setMessage('Erreur lors de l’ajout de l’humeur.');
    }
  };

  return (
    <div>
      <h2>Suivi de votre humeur</h2>

      <form onSubmit={handleAjout}>
        <input
          type="text"
          placeholder="Comment vous sentez-vous aujourd’hui ?"
          value={nouvelleHumeur}
          onChange={(e) => setNouvelleHumeur(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {humeurs.map((humeur, index) => (
          <li key={index}>
            {humeur.date ? `${humeur.date} - ` : ''}{humeur.humeur}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuiviHumeur;
