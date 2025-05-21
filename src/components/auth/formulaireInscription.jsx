import React, { useState, useEffect } from 'react';
import { register } from '../../services/serviceAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const FormulaireInscription = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour récupérer le paramètre "role" dans l'URL
  const getRoleFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      const roleUpper = roleParam.toUpperCase();
      return roleUpper === 'PROFESSIONNEL' ? 'PROFESSIONNEL' : 'UTILISATEUR';
    }
    return 'UTILISATEUR';
  };

  const [form, setForm] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: getRoleFromUrl(),
  });
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    // Met à jour le rôle si l'URL change (navigation)
    setForm((prev) => ({ ...prev, role: getRoleFromUrl() }));
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/connexion');
    } catch (err) {
      console.error(err);
      setErreur('Erreur lors de l’inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      <input
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Nom complet"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
        required
      />
      <input
        name="motDePasse"
        value={form.motDePasse}
        onChange={handleChange}
        placeholder="Mot de passe"
        type="password"
        required
      />

      <label>Rôle :</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="UTILISATEUR">Utilisateur</option>
        <option value="PROFESSIONNEL">Professionnel</option>
      </select>

      <button type="submit">S’inscrire</button>
    </form>
  );
};

export default FormulaireInscription;
