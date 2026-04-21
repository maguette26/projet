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
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 px-4">
        <div className="backdrop-blur-xl bg-white/50 border border-gray-200 rounded-3xl shadow-2xl p-12 w-full max-w-md animate-fadeIn">
          
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Bienvenue sur PsyConnect 👋</h1>
            <p className="text-gray-600">Connectez-vous pour accéder à vos fonctionnalités personnalisées</p>
          </div>

          <form onSubmit={handleConnexion} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  placeholder="exemple@domaine.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="py-3 px-8 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg transform hover:scale-105 transition duration-300"
              >
                Se connecter
              </button>
            </div>

            {message && (
              <p className={`text-center text-sm mt-2 ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>
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