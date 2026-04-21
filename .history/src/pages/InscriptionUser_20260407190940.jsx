// src/pages/InscriptionUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { User, Mail, Lock, Phone } from 'lucide-react';

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

  const [offsets, setOffsets] = useState({
    c1: { x: 0, y: 0 },
    c2: { x: 0, y: 0 },
    c3: { x: 0, y: 0 }
  });

  useEffect(() => {
    let frame;
    const animate = () => {
      const t = Date.now() / 1000;
      setOffsets({
        c1: { x: 20 * Math.sin(t), y: 15 * Math.cos(t) },
        c2: { x: 25 * Math.cos(t / 1.2), y: 20 * Math.sin(t) },
        c3: { x: 15 * Math.sin(t / 1.5), y: 18 * Math.cos(t) },
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        ...formData,
        confirmMotDePasse: formData.confirmerMotDePasse
      });
      setSuccess("Inscription réussie !");
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setErrors({ general: "Erreur lors de l'inscription" });
    }
  };

  const Input = ({ icon: Icon, name, type, placeholder }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition shadow-sm"
      />
    </div>
  );

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">

        {/* LEFT PREMIUM */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-tr from-blue-200 to-blue-400">

          {/* Cercles flous */}
          <div className="absolute w-full h-full">
            <div
              className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-50"
              style={{ transform: `translate(${offsets.c1.x}px, ${offsets.c1.y}px)` }}
            />
            <div
              className="absolute w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-40"
              style={{ transform: `translate(${offsets.c2.x}px, ${offsets.c2.y}px)` }}
            />
            <div
              className="absolute w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30"
              style={{ transform: `translate(${offsets.c3.x}px, ${offsets.c3.y}px)` }}
            />
          </div>

          <div className="relative z-10 text-center px-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PsyConnect
            </h1>
            <p className="text-gray-800 text-lg">
              Votre espace bien-être, moderne et sécurisé.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">

            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Inscription
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {errors.general && (
                <p className="text-red-500 text-center">{errors.general}</p>
              )}
              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}

              <Input icon={User} name="nom" type="text" placeholder="Nom" />
              <Input icon={User} name="prenom" type="text" placeholder="Prénom" />
              <Input icon={Mail} name="email" type="email" placeholder="Email" />
              <Input icon={Phone} name="telephone" type="tel" placeholder="Téléphone" />
              <Input icon={Lock} name="motDePasse" type="password" placeholder="Mot de passe" />
              <Input icon={Lock} name="confirmerMotDePasse" type="password" placeholder="Confirmer mot de passe" />

              <button className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105">
                S'inscrire
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-gray-600">
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