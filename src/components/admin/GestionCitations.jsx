import React, { useEffect, useState } from 'react';
import { getCitations, publierCitation, supprimerCitation } from '../../services/serviceAdmin';

const GestionCitations = () => {
  const [citations, setCitations] = useState([]);
  const [nouvelleCitation, setNouvelleCitation] = useState('');

  useEffect(() => {
    fetchCitations();
  }, []);

  const fetchCitations = async () => {
    const data = await getCitations();
    setCitations(data);
  };

  const handlePublier = async () => {
    if (nouvelleCitation.trim() === '') return;
    await publierCitation({ texte: nouvelleCitation });
    setNouvelleCitation('');
    fetchCitations();
  };

  const handleSupprimer = async (id) => {
    await supprimerCitation(id);
    fetchCitations();
  };

  return (
    <div>
      <h2>Gestion des citations</h2>
      <input
        type="text"
        value={nouvelleCitation}
        onChange={(e) => setNouvelleCitation(e.target.value)}
        placeholder="Nouvelle citation"
      />
      <button onClick={handlePublier}>Publier</button>

      <ul>
        {citations.map((citation) => (
          <li key={citation.id}>
            {citation.texte}
            <button onClick={() => handleSupprimer(citation.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionCitations;
