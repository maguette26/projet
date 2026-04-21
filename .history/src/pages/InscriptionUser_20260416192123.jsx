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

  // 👁️ password toggle
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

  // 👇 INPUT CONFIG PROPRE
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

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <h1 className="text-3xl font-bold">Bienvenue sur PsyConnect</h1>
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-6">

          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-bold text-center mb-6">
              Inscription
            </h2>

            {errors.general && (
              <p className="text-red-500 text-center mb-4">{errors.general}</p>
            )}

            {success && (
              <p className="text-green-600 text-center mb-4">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {fields.map(({ id, label, icon, toggle }) => {

                const isPassword = id === 'motDePasse';
                const isConfirm = id === 'confirmerMotDePasse';

                const type =
                  toggle
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
                        <i className={`fas ${icon}`}></i>
                      </span>

                      {/* INPUT */}
                      <input
                        name={id}
                        type={type}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={label}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500
                          ${errors[id] ? "border-red-500" : "border-gray-300"}`}
                      />

                      {/* TOGGLE PASSWORD */}
                      {toggle && (
                        <span
                          onClick={() => {
                            if (isPassword) setShowPassword(!showPassword);
                            if (isConfirm) setShowConfirmPassword(!showConfirmPassword);
                          }}
                          className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        >
                          <i className={`fas ${
                            (isPassword && showPassword) ||
                            (isConfirm && showConfirmPassword)
                              ? "fa-eye-slash"
                              : "fa-eye"
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