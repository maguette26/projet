// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const responseData = await login(email, motDePasse);
      const { role } = responseData;
      const cleanedRole = role.replace('ROLE_', '');
      let roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;
      localStorage.setItem('role', roleToStore);

      setMessage('Connexion réussie ! Redirection en cours...');

      setTimeout(() => {
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
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Connexion échouée. Veuillez vérifier votre email/mot de passe.";
      setMessage("Erreur : " + errorMessage);
      console.error("Erreur de connexion:", error.response || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md">
          {/* Card principale avec effet glassmorphism */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/50 shadow-2xl rounded-3xl p-10 transform hover:-translate-y-1 transition-all duration-300">
            
            {/* Header avec logo/branding */}
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                PsyConnect
              </h2>
              <p className="text-gray-600 font-medium">Accédez à votre espace thérapeutique</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleConnexion} className="space-y-6">
              
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium"
                  placeholder="Votre email"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium"
                  placeholder="Votre mot de passe"
                />
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>

              {/* Message d'erreur/succès */}
              {message && (
                <div className={`p-4 rounded-2xl text-center font-medium transition-all duration-300 ${
                  message.includes("réussie") 
                    ? 'bg-green-100 border-2 border-green-200 text-green-800 shadow-lg' 
                    : 'bg-red-100 border-2 border-red-200 text-red-800 shadow-lg'
                }`}>
                  {message}
                </div>
              )}

              {/* Lien inscription */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/inscription" 
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer décoratif */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 PsyConnect. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;