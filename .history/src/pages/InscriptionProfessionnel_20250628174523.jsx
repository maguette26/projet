import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/commun/Layout';

const InputField = ({ id, label, type = 'text', autoComplete, value, onChange, error, placeholder }) => (
  <div className="flex flex-col mb-3">
    <label htmlFor={id} className="mb-1 text-gray-800 font-semibold text-xs">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={`border rounded-md px-2 py-1 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition
        ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'}`}
    />
    {error && <p className="text-red-600 text-[10px] mt-1 italic font-medium">{error}</p>}
  </div>
);

const InscriptionProfessionnel = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    justificatif: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
    if (!/[a-z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
    if (!/[0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un chiffre.");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire.";
      isValid = false;
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est obligatoire.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide.";
      isValid = false;
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est obligatoire.";
      isValid = false;
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Le format du numéro de téléphone n'est pas valide.";
      isValid = false;
    }
    if (!formData.specialite.trim()) {
      newErrors.specialite = "La spécialité est obligatoire.";
      isValid = false;
    }
    if (!formData.justificatif) {
      newErrors.justificatif = "Le justificatif est obligatoire.";
      isValid = false;
    }
    const passwordErrors = validatePassword(formData.motDePasse);
    if (passwordErrors.length > 0) {
      newErrors.motDePasse = passwordErrors.join(" ");
      isValid = false;
    }
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, justificatif: e.target.files[0] }));
    if (errors.justificatif) setErrors(prev => ({ ...prev, justificatif: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Empêche double clic

    setErrors({});
    setSuccess(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null) {
          if (key === 'justificatif') {
            formPayload.append('document', val);
          } else {
            formPayload.append(key, val);
          }
        }
      });

      await api.post('/professionnels/inscription', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess("Votre inscription a été prise en compte avec succès. Veuillez attendre la validation par l'administrateur.");
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        specialite: '',
        motDePasse: '',
        confirmerMotDePasse: '',
        justificatif: null,
      });

      // Redirection automatique après 6 secondes
      setTimeout(() => navigate('/'), 6000);
    } catch (err) {
      console.error("Erreur d'inscription:", err.response?.data || err.message);
      const message = err.response?.data?.message || err.response?.data || '';
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

      if (messageStr.includes('Duplicate entry') && messageStr.includes('unique_email')) {
        setErrors(prev => ({ ...prev, email: "Cette adresse email est déjà utilisée. Veuillez en choisir une autre." }));
      } else if (err.response?.data?.message) {
        setErrors(prev => ({ ...prev, general: err.response.data.message }));
      } else {
        setErrors(prev => ({ ...prev, general: "Erreur lors de l'inscription. Veuillez réessayer plus tard." }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-6 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-5 text-center tracking-wide">
            Inscription Professionnel
          </h2>
          <p className="text-center text-gray-700 mb-6 text-base font-medium">
            Créez votre compte professionnel ici
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data" noValidate>
            {errors.general && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center text-sm font-semibold mb-4">
                {errors.general}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center text-sm font-semibold mb-4">
                {success}
              </div>
            )}

            <InputField
              id="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              autoComplete="family-name"
            />
            <InputField
              id="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              error={errors.prenom}
              autoComplete="given-name"
            />
            <InputField
              id="email"
              label="Adresse email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <InputField
              id="telephone"
              label="Téléphone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              error={errors.telephone}
              autoComplete="tel"
            />
            <InputField
              id="specialite"
              label="Spécialité"
              value={formData.specialite}
              onChange={handleChange}
              error={errors.specialite}
              placeholder="Ex: Psychologue, Psychiatre..."
            />

            <div className="flex flex-col mb-3">
              <label htmlFor="justificatif" className="mb-1 text-gray-800 font-semibold text-xs">
                Justificatif (PDF, JPG, PNG)
              </label>
              <input
                id="justificatif"
                name="justificatif"
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className={`border rounded-md px-2 py-1 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition
                  ${errors.justificatif ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'}`}
              />
              {errors.justificatif && (
                <p className="text-red-600 text-[10px] mt-1 italic font-medium">{errors.justificatif}</p>
              )}
            </div>

            <InputField
              id="motDePasse"
              label="Mot de passe"
              type="password"
              value={formData.motDePasse}
              onChange={handleChange}
              error={errors.motDePasse}
              autoComplete="new-password"
            />
            <InputField
              id="confirmerMotDePasse"
              label="Confirmer le mot de passe"
              type="password"
              value={formData.confirmerMotDePasse}
              onChange={handleChange}
              error={errors.confirmerMotDePasse}
              autoComplete="new-password"
            />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-40 py-2 font-semibold text-sm rounded-xl shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-3 focus:ring-indigo-400
                  ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-700 text-xs font-medium">
            Vous avez déjà un compte ?{' '}
            <Link to="/connexion" className="font-semibold text-indigo-600 hover:underline hover:text-indigo-800 transition">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default InscriptionProfessionnel;
