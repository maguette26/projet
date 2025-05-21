import React, { useEffect, useState } from 'react';
import { getRessources, ajouterRessource, modifierRessource, supprimerRessource } from '../../services/serviceAdmin';

const GestionRessources = () => {
  const [ressources, setRessources] = useState([]);
  const [nouvelleRessource, setNouvelleRessource] = useState({
    titre: '',
    type: '', // article, vidéo, podcast
    description: '',
    url: '',
    premium: false,
  });

  useEffect(() => {
    fetchRessources();
  }, []);

  const fetchRessources = async () => {
    const data = await getRessources();
    setRessources(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNouvelleRessource(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAjouter = async () => {
    if (!nouvelleRessource.titre.trim()) return;
    await ajouterRessource(nouvelleRessource);
    setNouvelleRessource({
      titre: '',
      type: '',
      description: '',
      url: '',
      premium: false,
    });
    fetchRessources();
  };

  const handleSupprimer = async (id) => {
    await supprimerRessource(id);
    fetchRessources();
  };

  return (
    <div>
      <h2>Gestion des ressources éducatives</h2>
      <input
        name="titre"
        value={nouvelleRessource.titre}
        onChange={handleChange}
        placeholder="Titre"
      />
      <select name="type" value={nouvelleRessource.type} onChange={handleChange}>
        <option value="">Sélectionner un type</option>
        <option value="article">Article</option>
        <option value="video">Vidéo</option>
        <option value="podcast">Podcast</option>
      </select>
      <input
        name="description"
        value={nouvelleRessource.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="url"
        value={nouvelleRessource.url}
        onChange={handleChange}
        placeholder="URL"
      />
      <label>
        Premium
        <input
          type="checkbox"
          name="premium"
          checked={nouvelleRessource.premium}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleAjouter}>Ajouter</button>

      <ul>
        {ressources.map((res) => (
          <li key={res.id}>
            <strong>{res.titre}</strong> ({res.type}) {res.premium && <em>(Premium)</em>}
            <button onClick={() => handleSupprimer(res.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionRessources;
