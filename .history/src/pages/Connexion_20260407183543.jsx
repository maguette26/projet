<// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const responseData = await login(email, motDePasse);
      const { role } = responseData;
      const cleanedRole = role.replace('ROLE_', '');
      const roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;
      localStorage.setItem('role', roleToStore);

      setMessage('Connexion réussie ! Redirection en cours...');

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
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Connexion échouée. Veuillez vérifier votre email/mot de passe.";
      setMessage("Erreur : " + errorMessage);
      console.error("Erreur de connexion:", error.response || error.message);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left illustration side */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 rounded-l-3xl relative">
          <svg className="absolute w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="120" fill="#3b82f6" />
            <circle cx="600" cy="400" r="150" fill="#60a5fa" />
            <circle cx="400" cy="300" r="180" fill="#93c5fd" />
          </svg>
          <div className="relative z-10 text-center p-10 max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Bienvenue sur PsyConnect</h1>
            <p className="text-gray-700 text-lg">
              Suivez votre bien-être mental et accédez à vos fonctionnalités facilement.
            </p>
          </div>
        </div>

        {/* Right form side */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>
            <form onSubmit={handleConnexion} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemple@domaine.com"
                  className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
              >
                Se connecter
              </button>

              {message && (
                <p className={`text-center mt-2 text-sm ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Pas encore de compte ? 
              <Link to="/inscription" className="ml-1 text-blue-600 font-semibold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;>