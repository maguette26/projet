import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';
import { motion } from 'framer-motion';

// État initial du formulaire
const initialState = {
  email: '',
  motDePasse: '',
  loading: false,
  message: '',
  error: false,
};

// Actions du reducer
const actions = {
  SET_FIELD: 'SET_FIELD',
  SET_LOADING: 'SET_LOADING',
  SET_MESSAGE: 'SET_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  RESET_MESSAGE: 'RESET_MESSAGE',
};

// Reducer pour gérer le state
function reducer(state, action) {
  switch (action.type) {
    case actions.SET_FIELD:
      return { ...state, [action.field]: action.value };
    case actions.SET_LOADING:
      return { ...state, loading: action.value };
    case actions.SET_MESSAGE:
      return { ...state, message: action.message, error: false };
    case actions.SET_ERROR:
      return { ...state, message: action.message, error: true, loading: false };
    case actions.RESET_MESSAGE:
      return { ...state, message: '', error: false };
    default:
      return state;
  }
}

const Connexion = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleChange = e => {
    dispatch({ type: actions.SET_FIELD, field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch({ type: actions.SET_LOADING, value: true });
    dispatch({ type: actions.RESET_MESSAGE });

    try {
      const responseData = await login(state.email, state.motDePasse);
      let { role } = responseData;

      // Nettoyage du rôle
      const cleanedRole = role.replace('ROLE_', '');
      let roleToStore = cleanedRole === 'USER' ? 'UTILISATEUR' : cleanedRole;

      localStorage.setItem('role', roleToStore);

      dispatch({ type: actions.SET_MESSAGE, message: 'Connexion réussie ! Redirection en cours...' });

      setTimeout(() => {
        switch (cleanedRole) {
          case 'ADMIN':
            navigate('/tableauAdmin');
            break;
          case 'PSYCHIATRE':
          case 'PSYCHOLOGUE':
          case 'USER':
          default:
            navigate('/');
            break;
        }
      }, 800);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Connexion échouée. Veuillez vérifier votre email/mot de passe.';
      dispatch({ type: actions.SET_ERROR, message: errorMessage });
      console.error("Erreur de connexion:", error.response || error.message);
    } finally {
      dispatch({ type: actions.SET_LOADING, value: false });
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 shadow-lg p-8 rounded-2xl border border-gray-200 bg-white">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 select-none">
              Connexion à PsyConnect
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour accéder à votre espace personnel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={state.email}
                  onChange={handleChange}
                  disabled={state.loading}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={state.motDePasse}
                  onChange={handleChange}
                  disabled={state.loading}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={state.loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                state.loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none`}
            >
              {state.loading ? 'Connexion...' : 'Se connecter'}
            </motion.button>

            {state.message && (
              <p
                className={`text-sm text-center ${
                  state.error ? 'text-red-500' : 'text-green-600'
                } select-none mt-2`}
                role="alert"
              >
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;
