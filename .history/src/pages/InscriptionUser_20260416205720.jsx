// src/pages/InscriptionUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login } from '../services/serviceAuth';
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

  // 👁️ show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("Une majuscule est requise.");
    if (!/[a-z]/.test(password)) errors.push("Une minuscule est requise.");
    if (!/[0-9]/.test(password)) errors.push("Un chiffre est requis.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Un caractère spécial est requis.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) { newErrors.nom = "Nom obligatoire"; isValid = false; }
    if (!formData.prenom.trim()) { newErrors.prenom = "Prénom obligatoire"; isValid = false; }

    if (!formData.email.trim()) {
      newErrors.email = "Email obligatoire";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
      isValid = false;
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Téléphone obligatoire";
      isValid = false;
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Téléphone invalide";
      isValid = false;
    }

    const passErrors = validatePassword(formData.motDePasse);
    if (passErrors.length) {
      newErrors.motDePasse = passErrors.join(" ");
      isValid = false;
    }

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
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
      await api.post('/auth/register', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.motDePasse,
        confirmMotDePasse: formData.confirmerMotDePasse,
        telephone: formData.telephone
      });

      const responseData = await login(formData.email, formData.motDePasse);
      const cleanedRole = responseData.role.replace('ROLE_', '');

      localStorage.setItem('role', cleanedRole);

      setSuccess('Inscription réussie !');

      if (cleanedRole === 'ADMIN') navigate('/tableauAdmin');
      else navigate('/');

    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Erreur lors de l'inscription"
      });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <svg className="absolute w-full h-full" viewBox="0 0 800 600">
            <circle cx="200" cy="200" r="120" fill="#93c5fd" />
            <circle cx="600" cy="400" r="150" fill="#60a5fa" />
            <circle cx="400" cy="300" r="180" fill="#3b82f6" />
          </svg>

          <div className="relative z-10 text-center px-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur PsyConnect
            </h1>
            <p className="text-gray-700 text-lg">
              Créez votre compte facilement et rapidement.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
              Inscription Utilisateur
            </h2>

            {errors.general && (
              <p className="text-red-500 text-center text-sm mb-3">
                {errors.general}
              </p>
            )}

            {success && (
              <p className="text-green-600 text-center text-sm mb-3">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* INPUTS AVEC ICÔNES */}
              {[
                { id: 'nom', label: 'Nom', type: 'text', icon: 'fa-user', autoComplete: 'family-name' },
                { id: 'prenom', label: 'Prénom', type: 'text', icon: 'fa-user', autoComplete: 'given-name' },
                { id: 'email', label: 'Adresse email', type: 'email', icon: 'fa-envelope', autoComplete: 'email' },
                { id: 'telephone', label: 'Téléphone', type: 'tel', icon: 'fa-phone', autoComplete: 'tel' },
                { id: 'motDePasse', label: 'Mot de passe', type: 'password', icon: 'fa-lock', autoComplete: 'new-password' },
                { id: 'confirmerMotDePasse', label: 'Confirmer le mot de passe', type: 'password', icon: 'fa-lock', autoComplete: 'new-password' },
              ].map(({ id, label, type, icon, autoComplete }) => {
                const isPassword = id === 'motDePasse' || id === 'confirmerMotDePasse';

                return (
                  <div key={id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>

                    <div className="relative">

                      {/* ICON */}
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <i className={`fas ${icon}`}></i>
                      </span>

                      <input
                        name={id}
                        type={
                          isPassword
                            ? id === 'motDePasse'
                              ? (showPassword ? 'text' : 'password')
                              : (showConfirmPassword ? 'text' : 'password')
                            : type
                        }
                        autoComplete={autoComplete}
                        value={formData[id]}
                        onChange={handleChange}
                        required
                        placeholder={label}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
                          ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
                      />

                      {/* EYE BUTTON */}
                      {isPassword && (
                        <button
                          type="button"
                          onClick={() =>
                            id === 'motDePasse'
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 px-3 text-gray-500"
                        >
                          <i
                            className={`fas ${
                              (id === 'motDePasse' ? showPassword : showConfirmPassword)
                                ? 'fa-eye-slash'
                                : 'fa-eye'
                            }`}
                          ></i>
                        </button>
                      )}

                    </div>

                    {errors[id] && (
                      <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
                    )}
                  </div>
                );
              })}

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
              >
                S'inscrire
              </button>

            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Déjà un compte ?
              <Link to="/connexion" className="ml-1 text-blue-600 font-semibold hover:underline">
                Connexion
              </Link>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default InscriptionUser;