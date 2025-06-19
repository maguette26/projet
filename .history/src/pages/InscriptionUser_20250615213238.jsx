// src/pages/InscriptionUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/commun/Layout';

const InscriptionUser = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    telephone: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
    if (!/[a-z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
    if (!/[0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un chiffre.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire.";
      isValid = false;
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est obligatoire.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide.";
      isValid = false;
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est obligatoire.";
      isValid = false;
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Le format du numéro de téléphone n'est pas valide.";
      isValid = false;
    }
    const passwordErrors = validatePassword(formData.motDePasse);
    if (passwordErrors.length > 0) {
      newErrors.motDePasse = passwordErrors.join(" ");
      isValid = false;
    }
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.motDePasse,
        confirmMotDePasse: formData.confirmerMotDePasse,
        telephone: formData.telephone
      };

      await api.post('/auth/register', dataToSubmit);

      setSuccess('Inscription réussie ! Vous allez être redirigé...');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (err) {
      console.error('Erreur d\'inscription:', err.response?.data || err.message);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        const errorMessages = backendErrors.map(e => e.defaultMessage || e.message).join(' ');
        setErrors(prev => ({ ...prev, general: errorMessages }));
      } else if (err.response?.data?.message) {
        setErrors(prev => ({ ...prev, general: err.response.data.message }));
      } else {
        setErrors(prev => ({ ...prev, general: 'Erreur lors de l\'inscription. Veuillez réessayer.' }));
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 to-white px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
            Inscription Utilisateur
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Créez votre compte pour accéder aux ressources et au forum.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4 text-center">
                {errors.general}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm mb-4 text-center">
                {success}
              </div>
            )}

            {[
              { id: 'nom', label: 'Nom', type: 'text', autoComplete: 'family-name' },
              { id: 'prenom', label: 'Prénom', type: 'text', autoComplete: 'given-name' },
              { id: 'email', label: 'Adresse email', type: 'email', autoComplete: 'email' },
              { id: 'telephone', label: 'Téléphone (ex: +212 600 000000)', type: 'tel', autoComplete: 'tel' },
              { id: 'motDePasse', label: 'Mot de passe', type: 'password', autoComplete: 'new-password' },
              { id: 'confirmerMotDePasse', label: 'Confirmer le mot de passe', type: 'password', autoComplete: 'new-password' },
            ].map(({ id, label, type, autoComplete }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  autoComplete={autoComplete}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                    ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={label}
                />
                {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              S'inscrire
            </button>
          </form>

          <p className="mt-6 text-center text-gray-700 text-sm">
            Vous avez déjà un compte ?{' '}
            <Link to="/connexion" className="font-semibold text-indigo-600 hover:underline">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default InscriptionUser;
