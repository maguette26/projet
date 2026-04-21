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

  // 👁️ TOGGLE PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("1 majuscule.");
    if (!/[a-z]/.test(password)) errors.push("1 minuscule.");
    if (!/[0-9]/.test(password)) errors.push("1 chiffre.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("1 caractère spécial.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Nom obligatoire.";
      isValid = false;
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom obligatoire.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email obligatoire.";
      isValid = false;
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Téléphone obligatoire.";
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

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      await api.post('/auth/register', formData);

      const responseData = await login(formData.email, formData.motDePasse);

      const { role } = responseData;
      const cleanedRole = role.replace('ROLE_', '');
      const roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;

      localStorage.setItem('role', roleToStore);

      setSuccess('Inscription réussie !');

      navigate('/');
    } catch (err) {
      setErrors({ general: "Erreur d'inscription" });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <div className="text-center px-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur PsyConnect
            </h1>
            <p className="text-gray-700 text-lg">
              Créez votre compte facilement.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
              Inscription
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {[
                { id: 'nom', label: 'Nom', icon: 'fa-user' },
                { id: 'prenom', label: 'Prénom', icon: 'fa-user' },
                { id: 'email', label: 'Email', icon: 'fa-user' },
                { id: 'telephone', label: 'Téléphone', icon: 'fa-phone' },
                { id: 'motDePasse', label: 'Mot de passe', icon: 'fa-lock', toggle: true },
                { id: 'confirmerMotDePasse', label: 'Confirmer mot de passe', icon: 'fa-lock', toggle: true },
              ].map(({ id, label, icon, toggle }) => {

                const isPassword = id === 'motDePasse';
                const isConfirm = id === 'confirmerMotDePasse';

                const type = toggle
                  ? (isPassword
                      ? (showPassword ? 'text' : 'password')
                      : (showConfirmPassword ? 'text' : 'password'))
                  : (id === 'email' ? 'email' : 'text');

                return (
                  <div key={id}>
                    <label className="block text-sm text-gray-700 mb-1">
                      {label}
                    </label>

                    <div className="relative">

                      {/* LEFT ICON */}
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <i className={`fas ${icon}`}></i>
                      </span>

                      <input
                        name={id}
                        type={type}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={label}
                        className={`w-full pl-10 pr-10 py-3 rounded-xl border
                          ${errors[id] ? 'border-red-500' : 'border-gray-300'}
                          focus:ring-2 focus:ring-indigo-500`}
                      />

                      {/* TOGGLE */}
                      {toggle && (
                        <span
                          onClick={() => {
                            if (isPassword) setShowPassword(!showPassword);
                            if (isConfirm) setShowConfirmPassword(!showConfirmPassword);
                          }}
                          className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${
                            (isPassword && showPassword) || (isConfirm && showConfirmPassword)
                              ? 'fa-eye-slash'
                              : 'fa-eye'
                          }`}></i>
                        </span>
                      )}

                    </div>

                    {errors[id] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[id]}
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                S'inscrire
              </button>

              {errors.general && (
                <p className="text-red-500 text-center">{errors.general}</p>
              )}

              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}

            </form>

            <p className="text-center mt-4">
              Déjà un compte ?
              <Link to="/connexion" className="text-indigo-600 ml-1">
                Se connecter
              </Link>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default InscriptionUser;