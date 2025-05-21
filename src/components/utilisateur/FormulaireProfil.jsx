import React, { useState, useEffect } from 'react';
import { getProfil, modifierProfil } from '../../services/serviceUtilisateur';

const FormulaireProfil = () => {
  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProfil() {
      try {
        const data = await getProfil();
        if (data) setProfil(data);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    }
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await modifierProfil(profil);
      setMessage('Profil mis à jour avec succès !');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Modifier votre profil</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input type="text" name="nom" value={profil.nom} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Prénom :
          <input type="text" name="prenom" value={profil.prenom} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email :
          <input type="email" name="email" value={profil.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Téléphone :
          <input type="tel" name="telephone" value={profil.telephone} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Enregistrer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FormulaireProfil;
