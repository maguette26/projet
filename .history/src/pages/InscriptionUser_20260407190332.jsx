// src/pages/InscriptionUser.jsx
import React, { useState, useEffect } from 'react';
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

  // Animation cercles
  const [offsets, setOffsets] = useState({
    circle1: { x: 0, y: 0 },
    circle2: { x: 0, y: 0 },
    circle3: { x: 0, y: 0 }
  });

  useEffect(() => {
    let frame;
    const animate = () => {
      const t = Date.now() / 1000;
      setOffsets({
        circle1: { x: 15 * Math.sin(t), y: 10 * Math.cos(t / 1.5) },
        circle2: { x: 20 * Math.cos(t / 1.2), y: 15 * Math.sin(t / 2) },
        circle3: { x: 10 * Math.sin(t / 1.8), y: 12 * Math.cos(t / 1.3) },
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Min 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("1 majuscule.");
    if (!/[a-z]/.test(password)) errors.push("1 minuscule.");
    if (!/[0-9]/.test(password)) errors.push("1 chiffre.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("1 caractère spécial.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom) { newErrors.nom = "Nom requis"; isValid=false; }
    if (!formData.prenom) { newErrors.prenom = "Prénom requis"; isValid=false; }

    if (!formData.email) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";

    if (!formData.telephone) newErrors.telephone = "Téléphone requis";

    const pwdErrors = validatePassword(formData.motDePasse);
    if (pwdErrors.length) newErrors.motDePasse = pwdErrors.join(" ");

    if (formData.motDePasse !== formData.confirmerMotDePasse)
      newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        ...formData,
        confirmMotDePasse: formData.confirmerMotDePasse
      });

      setSuccess("Inscription réussie !");
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.message || "Erreur lors de l'inscription"
      }));
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 items-center justify-center rounded-l-3xl overflow-hidden relative bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300">
          <svg className="absolute w-full h-full" viewBox="0 0 800 600">
            <circle cx={200 + offsets.circle1.x} cy={200 + offsets.circle1.y} r="120" fill="#93c5fd" />
            <circle cx={600 + offsets.circle2.x} cy={400 + offsets.circle2.y} r="150" fill="#60a5fa" />
            <circle cx={400 + offsets.circle3.x} cy={300 + offsets.circle3.y} r="180" fill="#3b82f6" />
          </svg>

          <div className="relative z-10 text-center p-10 max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rejoignez PsyConnect
            </h1>
            <p className="text-gray-700 text-lg">
              Créez votre compte et commencez votre parcours bien-être.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Inscription
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {errors.general && (
                <p className="text-red-500 text-center">{errors.general}</p>
              )}
              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}

              {[
                { id: 'nom', label: 'Nom' },
                { id: 'prenom', label: 'Prénom' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'telephone', label: 'Téléphone' },
                { id: 'motDePasse', label: 'Mot de passe', type: 'password' },
                { id: 'confirmerMotDePasse', label: 'Confirmer', type: 'password' },
              ].map(({ id, label, type = 'text' }) => (
                <div key={id}>
                  <input
                    name={id}
                    type={type}
                    value={formData[id]}
                    onChange={handleChange}
                    placeholder={label}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors[id] ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors[id] && (
                    <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
                  )}
                </div>
              ))}

              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
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