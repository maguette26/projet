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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ RESET FORM AJOUTÉ
  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      confirmerMotDePasse: '',
      telephone: ''
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setSuccess(null);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("8 caractères min.");
    if (!/[A-Z]/.test(password)) errors.push("1 majuscule");
    if (!/[a-z]/.test(password)) errors.push("1 minuscule");
    if (!/[0-9]/.test(password)) errors.push("1 chiffre");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("1 caractère spécial");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Nom obligatoire";
      isValid = false;
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom obligatoire";
      isValid = false;
    }

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

      // ✅ RESET FORM APRES INSCRIPTION
      resetForm();

      switch (cleanedRole) {
        case 'ADMIN':
          navigate('/tableauAdmin');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      console.log("ERREUR BACKEND:", err.response?.data);
      console.log("STATUS:", err.response?.status);

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
              <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-sm text-center">
                {errors.general}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-2 mb-3 rounded text-sm text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

              {/* NOM */}
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Nom"
              />
              {errors.nom && <p className="text-red-500 text-xs">{errors.nom}</p>}

              {/* PRENOM */}
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Prénom"
              />
              {errors.prenom && <p className="text-red-500 text-xs">{errors.prenom}</p>}

              {/* EMAIL */}
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

              {/* TELEPHONE */}
              <input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Téléphone"
              />
              {errors.telephone && <p className="text-red-500 text-xs">{errors.telephone}</p>}

              {/* PASSWORD */}
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Mot de passe"
              />
              {errors.motDePasse && <p className="text-red-500 text-xs">{errors.motDePasse}</p>}

              {/* CONFIRM */}
              <input
                type="password"
                name="confirmerMotDePasse"
                value={formData.confirmerMotDePasse}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full pl-10 py-2 border rounded-lg"
                placeholder="Confirmer mot de passe"
              />
              {errors.confirmerMotDePasse && <p className="text-red-500 text-xs">{errors.confirmerMotDePasse}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                S'inscrire
              </button>

            </form>

            <p className="text-center text-sm mt-4">
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