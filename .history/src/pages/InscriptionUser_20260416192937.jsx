// src/pages/InscriptionUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';

// ✅ FONT AWESOME
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

  // ✅ AJOUT SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

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

      const responseData = await login(formData.email, formData.motDePasse);

      const { role } = responseData;
      const cleanedRole = role.replace('ROLE_', '');
      const roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;

      localStorage.setItem('role', roleToStore);

      setSuccess('Inscription réussie ! Redirection en cours...');

      switch (cleanedRole) {
        case 'ADMIN':
          navigate('/tableauAdmin');
          break;
        case 'PSYCHIATRE':
        case 'PSYCHOLOGUE':
        case 'USER':
          navigate('/');
          break;
        default:
          navigate('/');
      }

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

            <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
              Inscription Utilisateur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {errors.general && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm text-center">
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm text-center">
                  {success}
                </div>
              )}

              {[
                { id: 'nom', icon: faUser, type: 'text' },
                { id: 'prenom', icon: faUser, type: 'text' },
                { id: 'email', icon: faEnvelope, type: 'email' },
                { id: 'telephone', icon: faPhone, type: 'tel' }
              ].map(({ id, icon, type }) => (
                <div key={id}>
                  <label className="block text-sm mb-1">{id}</label>

                  <div className="relative">
                    <FontAwesomeIcon icon={icon} className="absolute left-3 top-3 text-gray-400" />

                    <input
                      name={id}
                      type={type}
                      value={formData[id]}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border rounded-lg"
                    />
                  </div>

                  {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
                </div>
              ))}

              {/* PASSWORD */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />

                <input
                  name="motDePasse"
                  type={showPassword ? "text" : "password"}
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 p-2 border rounded-lg"
                />

                <button type="button" onClick={togglePassword} className="absolute right-3 top-3 text-gray-500">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>

                {errors.motDePasse && <p className="text-red-500 text-xs">{errors.motDePasse}</p>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />

                <input
                  name="confirmerMotDePasse"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmerMotDePasse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 p-2 border rounded-lg"
                />

                <button type="button" onClick={toggleConfirmPassword} className="absolute right-3 top-3 text-gray-500">
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>

                {errors.confirmerMotDePasse && (
                  <p className="text-red-500 text-xs">{errors.confirmerMotDePasse}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
              >
                S'inscrire
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link to="/connexion" className="text-indigo-600 font-semibold">
                Connectez-vous ici
              </Link>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default InscriptionUser;