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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom) newErrors.nom = "Nom requis";
    if (!formData.prenom) newErrors.prenom = "Prénom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.telephone) newErrors.telephone = "Téléphone requis";

    if (formData.motDePasse.length < 6)
      newErrors.motDePasse = "Mot de passe trop court";

    if (formData.motDePasse !== formData.confirmerMotDePasse)
      newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post('/auth/register', formData);

      const response = await login(formData.email, formData.motDePasse);

      const role = response.role?.replace("ROLE_", "") || "USER";

      localStorage.setItem("role", role);

      setSuccess("Inscription réussie");

      navigate("/");
    } catch (err) {
      setErrors({ general: "Erreur lors de l'inscription" });
    }
  };

  const fields = [
    { id: 'nom', label: 'Nom', icon: 'fa-user' },
    { id: 'prenom', label: 'Prénom', icon: 'fa-user' },
    { id: 'email', label: 'Email', icon: 'fa-envelope' },
    { id: 'telephone', label: 'Téléphone', icon: 'fa-phone' },
    { id: 'motDePasse', label: 'Mot de passe', icon: 'fa-lock', toggle: true },
    { id: 'confirmerMotDePasse', label: 'Confirmer mot de passe', icon: 'fa-lock', toggle: true },
  ];

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* LEFT SIDE — SVG INCHANGÉ */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">

          {/* 🚨 SVG STRICTEMENT INCHANGÉ */}
          <svg className="absolute w-full h-full" viewBox="0 0 800 600">
            <circle cx="200" cy="200" r="120" fill="#93c5fd">
              <animate attributeName="cx" values="180;220;180" dur="6s" repeatCount="indefinite" />
              <animate attributeName="cy" values="180;220;180" dur="7s" repeatCount="indefinite" />
            </circle>

            <circle cx="600" cy="400" r="150" fill="#60a5fa">
              <animate attributeName="cx" values="580;620;580" dur="7s" repeatCount="indefinite" />
              <animate attributeName="cy" values="380;420;380" dur="6s" repeatCount="indefinite" />
            </circle>

            <circle cx="400" cy="300" r="180" fill="#3b82f6">
              <animate attributeName="cx" values="380;420;380" dur="8s" repeatCount="indefinite" />
              <animate attributeName="cy" values="280;320;280" dur="7s" repeatCount="indefinite" />
            </circle>
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

            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
              Inscription Utilisateur
            </h2>

            {errors.general && (
              <p className="text-red-500 text-center mb-4">
                {errors.general}
              </p>
            )}

            {success && (
              <p className="text-green-600 text-center mb-4">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {fields.map(({ id, label, icon, toggle }) => {
                const isPassword = id === 'motDePasse';
                const isConfirm = id === 'confirmerMotDePasse';

                const type = toggle
                  ? isPassword
                    ? (showPassword ? 'text' : 'password')
                    : (showConfirmPassword ? 'text' : 'password')
                  : (id === 'email' ? 'email' : 'text');

                return (
                  <div key={id}>
                    <label className="block text-sm mb-1">
                      {label}
                    </label>

                    <div className="relative">

                      {/* ICON */}
                      <span className="absolute left-3 top-3 text-gray-400">
                        <i className={`fas ${icon}`} />
                      </span>

                      {/* INPUT */}
                      <input
                        name={id}
                        type={type}
                        value={formData[id]}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
                          ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={label}
                      />

                      {/* TOGGLE PASSWORD */}
                      {toggle && (
                        <span
                          onClick={() => {
                            if (isPassword) setShowPassword(v => !v);
                            if (isConfirm) setShowConfirmPassword(v => !v);
                          }}
                          className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        >
                          <i className={`fas ${
                            (isPassword && showPassword) ||
                            (isConfirm && showConfirmPassword)
                              ? 'fa-eye-slash'
                              : 'fa-eye'
                          }`} />
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
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                S'inscrire
              </button>

            </form>

            <p className="text-center mt-4 text-sm">
              Déjà un compte ?{" "}
              <Link to="/connexion" className="text-indigo-600">
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