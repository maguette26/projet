// src/pages/InscriptionUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

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

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("8 caractères minimum.");
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
      newErrors.nom = "Nom requis";
      isValid = false;
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom requis";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
      isValid = false;
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Téléphone requis";
      isValid = false;
    }

    const passwordErrors = validatePassword(formData.motDePasse);
    if (passwordErrors.length > 0) {
      newErrors.motDePasse = passwordErrors.join(" ");
      isValid = false;
    }

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Mots de passe différents";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

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

      const { role } = responseData;
      const cleanedRole = role.replace('ROLE_', '');

      localStorage.setItem('role', cleanedRole);

      setSuccess('Inscription réussie !');

      switch (cleanedRole) {
        case 'ADMIN':
          navigate('/tableauAdmin');
          break;
        default:
          navigate('/');
      }

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

        {/* LEFT SIDE (INCHANGÉ) */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">

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
              <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-sm">
                {errors.general}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-2 mb-3 rounded text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NOM / PRENOM / EMAIL / TEL */}
              {[
                { id: 'nom', icon: faUser },
                { id: 'prenom', icon: faUser },
                { id: 'email', icon: faEnvelope },
                { id: 'telephone', icon: faPhone }
              ].map(({ id, icon }) => (
                <div key={id}>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={icon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      name={id}
                      value={formData[id]}
                      onChange={handleChange}
                      placeholder={id}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {errors[id] && (
                    <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
                  )}
                </div>
              ))}

              {/* PASSWORD */}
              <div>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="motDePasse"
                    type={showPassword ? "text" : "password"}
                    value={formData.motDePasse}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm"
                  />

                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>

                {errors.motDePasse && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.motDePasse}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="confirmerMotDePasse"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmerMotDePasse}
                    onChange={handleChange}
                    placeholder="Confirmer mot de passe"
                    className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm"
                  />

                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>

                {errors.confirmerMotDePasse && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmerMotDePasse}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                S'inscrire
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Déjà un compte ?{" "}
              <Link to="/connexion" className="text-indigo-600 font-semibold">
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