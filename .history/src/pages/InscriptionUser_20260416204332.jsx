// src/pages/InscriptionUser.jsx
import React, { useState, useEffect } from 'react';
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

  // ✅ même animation que Connexion.jsx
  const [offsets, setOffsets] = useState({
    circle1: { x: 0, y: 0 },
    circle2: { x: 0, y: 0 },
    circle3: { x: 0, y: 0 }
  });

  useEffect(() => {
    let frame;
    const animate = () => {
      const time = Date.now() / 1000;
      setOffsets({
        circle1: { x: 15 * Math.sin(time), y: 10 * Math.cos(time / 1.5) },
        circle2: { x: 20 * Math.cos(time / 1.2), y: 15 * Math.sin(time / 2) },
        circle3: { x: 10 * Math.sin(time / 1.8), y: 12 * Math.cos(time / 1.3) },
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("8 caractères min.");
    if (!/[A-Z]/.test(password)) errors.push("Majuscule requise.");
    if (!/[a-z]/.test(password)) errors.push("Minuscule requise.");
    if (!/[0-9]/.test(password)) errors.push("Chiffre requis.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Caractère spécial requis.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.nom) { newErrors.nom = "Nom obligatoire"; valid = false; }
    if (!formData.prenom) { newErrors.prenom = "Prénom obligatoire"; valid = false; }

    if (!formData.email.match(/\S+@\S+\.\S+/)) {
      newErrors.email = "Email invalide";
      valid = false;
    }

    if (!formData.telephone.match(/^\+?[0-9\s-]{8,}$/)) {
      newErrors.telephone = "Téléphone invalide";
      valid = false;
    }

    const passErrors = validatePassword(formData.motDePasse);
    if (passErrors.length) {
      newErrors.motDePasse = passErrors.join(' ');
      valid = false;
    }

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Mots de passe différents";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
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

      const response = await login(formData.email, formData.motDePasse);
      const cleanedRole = response.role.replace('ROLE_', '');

      localStorage.setItem('role', cleanedRole);

      setSuccess("Inscription réussie !");

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

        {/* LEFT SIDE (même style Connexion) */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <svg className="absolute w-full h-full" viewBox="0 0 800 600">
            <circle cx={200 + offsets.circle1.x} cy={200 + offsets.circle1.y} r="120" fill="#93c5fd" />
            <circle cx={600 + offsets.circle2.x} cy={400 + offsets.circle2.y} r="150" fill="#60a5fa" />
            <circle cx={400 + offsets.circle3.x} cy={300 + offsets.circle3.y} r="180" fill="#3b82f6" />
          </svg>

          <div className="relative z-10 text-center p-10 max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Bienvenue sur PsyConnect
            </h1>
            <p className="text-gray-700 text-lg">
              Créez votre compte et commencez maintenant.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-10">

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Inscription
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

            <form onSubmit={handleSubmit} className="space-y-4">

              {[
                 { name: 'nom', label: 'Nom', type: 'text', icon: 'fa-user' },
  { name: 'prenom', label: 'Prénom', type: 'text', icon: 'fa-user' },
  { name: 'email', label: 'Adresse email', type: 'email', icon: 'fa-envelope' },
  { name: 'telephone', label: 'Téléphone', type: 'tel', icon: 'fa-phone' },
  { name: 'motDePasse', label: 'Mot de passe', type: 'password', icon: 'fa-lock' },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

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