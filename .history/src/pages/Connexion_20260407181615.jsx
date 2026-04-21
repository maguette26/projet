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
      <div className="flex min-h-screen">
        {/* Left image / welcome side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-500 items-center justify-center p-10 rounded-l-3xl">
          <div className="text-white max-w-md">
            <h1 className="text-5xl font-bold mb-4">Bienvenue sur PsyConnect</h1>
            <p className="text-lg">Accédez à vos fonctionnalités personnalisées et suivez votre bien-être mental facilement.</p>
            <img src="https://source.unsplash.com/400x300/?mind,therapy" alt="psy illustration" className="mt-6 rounded-2xl shadow-lg" />
          </div>
        </div>

        {/* Right form side */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-10 rounded-r-3xl">
          <div className="w-full max-w-md animate-fadeIn">
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
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
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
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
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
              <Link to="/inscription" className="ml-1 text-indigo-600 font-semibold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;