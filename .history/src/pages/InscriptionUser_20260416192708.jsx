import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { login } from '../services/serviceAuth';
import Layout from '../components/commun/Layout';

// 👇 FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

const InscriptionUser = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    telephone: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // ... tes fonctions validatePassword / validateForm restent inchangées

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
              Inscription Utilisateur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NOM */}
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>

              {/* PRENOM */}
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>

              {/* TELEPHONE */}
              <div className="relative">
                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>

              {/* MOT DE PASSE */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="motDePasse"
                  type={showPassword ? "text" : "password"}
                  value={formData.motDePasse}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="w-full pl-10 pr-10 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmerMotDePasse"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmerMotDePasse}
                  onChange={handleChange}
                  placeholder="Confirmer mot de passe"
                  className="w-full pl-10 pr-10 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
              >
                S'inscrire
              </button>

            </form>

            <p className="text-center mt-4 text-sm">
              Déjà un compte ?{" "}
              <Link to="/connexion" className="text-indigo-600 font-semibold">
                Connexion
              </Link>
            </p>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InscriptionUser;