// src/pages/Connexion.jsx
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
      let roleToStore = cleanedRole;
      if (cleanedRole === 'USER') roleToStore = 'UTILISATEUR';
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
      const errorMessage = error.response?.data?.message || "Connexion échouée. Veuillez vérifier votre email/mot de passe.";
      setMessage("Erreur : " + errorMessage);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 to-white relative overflow-hidden">
        {/* flou arrière-plan */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30 z-0" />

        {/* carte de connexion */}
        <div className="relative z-10 w-full max-w-xl bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">Connexion à PsyConnect</h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Connectez-vous pour accéder à votre espace personnel
          </p>

          <form onSubmit={handleConnexion} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition duration-300"
            >
              Se connecter
            </button>

            {message && (
              <p className={`text-sm text-center ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            <div className="text-center text-sm text-gray-600 pt-4">
              Vous n'avez pas encore de compte ?
              <Link to="/inscription" className="ml-1 text-indigo-600 font-semibold hover:underline">
                Créer un compte
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;
