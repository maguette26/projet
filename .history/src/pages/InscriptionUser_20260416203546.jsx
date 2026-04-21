// src/pages/InscriptionUser.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';
import { Eye, EyeOff } from 'lucide-react';

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
    if (password.length < 8) errors.push("8 caractères min.");
    if (!/[A-Z]/.test(password)) errors.push("1 majuscule");
    if (!/[a-z]/.test(password)) errors.push("1 minuscule");
    if (!/[0-9]/.test(password)) errors.push("1 chiffre");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("1 caractère spécial");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom) newErrors.nom = "Nom obligatoire";
    if (!formData.prenom) newErrors.prenom = "Prénom obligatoire";
    if (!formData.email) newErrors.email = "Email obligatoire";
    if (!formData.telephone) newErrors.telephone = "Téléphone obligatoire";

    const passErrors = validatePassword(formData.motDePasse);
    if (passErrors.length) newErrors.motDePasse = passErrors.join(" ");

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Mots de passe différents";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      confirmerMotDePasse: '',
      telephone: ''
    });
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

      // 🔥 LOGIN AUTO (IMPORTANT pour header)
      const responseData = await login(formData.email, formData.motDePasse);

      const cleanedRole = responseData.role.replace('ROLE_', '');
      const roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;

      localStorage.setItem('role', roleToStore);
      localStorage.setItem('userId', responseData.id);

      // 🔥 IMPORTANT FIX HEADER UPDATE
      window.dispatchEvent(new Event("storage"));

      // 🔥 RESET FORM + UI CLEAN
      resetForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSuccess("Inscription réussie !");

      // 🔥 REDIRECTION
      setTimeout(() => {
        switch (cleanedRole) {
          case 'ADMIN':
            navigate('/tableauAdmin');
            break;
          default:
            navigate('/');
        }
      }, 500);

    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Erreur lors de l'inscription"
      });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <div className="text-center px-10">
            <h1 className="text-4xl font-bold">Bienvenue sur PsyConnect</h1>
            <p className="text-gray-700 mt-2">Créez votre compte</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-4">
          <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">

            <h2 className="text-3xl font-bold text-center mb-6">Inscription</h2>

            {errors.general && (
              <p className="text-red-500 text-center mb-3">{errors.general}</p>
            )}

            {success && (
              <p className="text-green-600 text-center mb-3">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NOM */}
              <input
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.nom && <p className="text-red-500 text-xs">{errors.nom}</p>}

              {/* EMAIL */}
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="motDePasse"
                  placeholder="Mot de passe"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full border p-2 rounded pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.motDePasse && <p className="text-red-500 text-xs">{errors.motDePasse}</p>}

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmerMotDePasse"
                  placeholder="Confirmer mot de passe"
                  value={formData.confirmerMotDePasse}
                  onChange={handleChange}
                  className="w-full border p-2 rounded pr-10"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {errors.confirmerMotDePasse && (
                <p className="text-red-500 text-xs">{errors.confirmerMotDePasse}</p>
              )}

              <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                S'inscrire
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Déjà un compte ? <Link to="/connexion" className="text-indigo-600">Connexion</Link>
            </p>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default InscriptionUser;