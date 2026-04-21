// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
        </div>

        <div className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                PsyConnect
              </h1>
              <p className="text-xl text-indigo-100 font-light">
                Bienvenue dans votre espace bien-être
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 md:p-10">
              <form onSubmit={handleConnexion} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Adresse email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl text-lg placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 shadow-lg"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Mot de passe</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17M6.839 17H21" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={motDePasse}
                        onChange={e => setMotDePasse(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl text-lg placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 shadow-lg"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                {message && (
                  <div className={`p-4 rounded-2xl text-center font-medium text-sm backdrop-blur-sm ${
                    message.includes("réussie") 
                      ? 'bg-green-500/20 text-green-100 border border-green-400/50' 
                      : 'bg-red-500/20 text-red-100 border border-red-400/50'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="text-center">
                  <Link 
                    to="/inscription" 
                    className="inline-flex items-center text-indigo-200 hover:text-white font-semibold text-sm transition-colors duration-300 group"
                  >
                    Créer un compte
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </form>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-20 -right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Layout>
  );
};

export default Connexion;