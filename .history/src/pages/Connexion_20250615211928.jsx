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
      let roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-white to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-white/30" />

        <div className="relative z-10 w-full max-w-4xl bg-white/80 rounded-3xl shadow-2xl border border-gray-200 p-12 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-2">Bienvenue sur PsyConnect</h2>
          <p className="text-md text-center text-gray-600 mb-8">
            Connectez-vous à votre espace personnel
          </p>

          <form onSubmit={handleConnexion} className="space-y-6 max-w-xl mx-auto w-full">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition duration-300"
            >
              Se connecter
            </button>

            {message && (
              <p className={`text-center text-sm ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            <div className="text-center text-sm text-gray-700 pt-6">
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
