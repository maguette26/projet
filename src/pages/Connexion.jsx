import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9094/api/auth/login', {
        email,
        motDePasse,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      setMessage('Connexion réussie !');
      navigate('/'); // Redirection vers la page d'accueil ou dashboard
    } catch (error) {
      setMessage("Erreur : " + (error.response?.data?.message || "Connexion échouée"));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 shadow-lg p-8 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Connexion à PsyConnect</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour accéder à votre espace personnel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleConnexion}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={motDePasse}
                onChange={e => setMotDePasse(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Se connecter
            </button>
          </div>
          {message && <p className={`text-sm text-center ${message.includes("réussie") ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Connexion;
