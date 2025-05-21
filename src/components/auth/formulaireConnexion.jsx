import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/serviceAuth';

const FormulaireConnexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, motDePasse); // Appel API
      localStorage.setItem('token', data.token);   // Stockage token
      localStorage.setItem('role', data.role);     // Stockage rôle (si renvoyé par le backend)

      // Redirection selon le rôle
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.role === 'PROFESSIONNEL') {
        navigate('/professionnel');
      } else {
        navigate('/utilisateur');
      }
    } catch (err) {
      setErreur('Email ou mot de passe incorrect.');
      
      console.error('Erreur complète :', err);
    console.error('Réponse serveur :', err.response?.data);
    }
  };

  return (
    <form onSubmit={handleConnexion}>
      <h2>Connexion</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default FormulaireConnexion;
