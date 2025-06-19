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
          break;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Connexion échouée. Veuillez vérifier votre email/mot de passe.";
      setMessage("Erreur : " + errorMessage);
      console.error("Erreur de connexion:", error.response || error.message);
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-100">
        <div className="backdrop-blur-md bg-white/70 border border-gray-200 shadow-2xl rounded-3xl p-12 w-full max-w-2xl">
          <div>
            <h2 className="text-center text-4xl font-bold text-indigo-700">Connexion à PsyConnect</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour accéder à 
            </p>
          </div>

          <form onSubmit={handleConnexion} className="mt-8 space-y-6 max-w-xl mx-auto w-full">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-semibold shadow"
              >
                Se connecter
              </button>
            </div>

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
