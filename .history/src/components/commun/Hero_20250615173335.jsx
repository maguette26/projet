// src/components/commun/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connexion');
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16 px-6 rounded-2xl shadow-md text-center animate-fade-in">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        Bienvenue sur <span className="text-indigo-500">PsyConnect</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Votre espace sécurisé pour rencontrer des professionnels de la santé mentale,
        explorer des ressources et échanger au sein d’une communauté bienveillante.
      </p>
      <button
        onClick={handleClick}
        className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-700 transition"
      >
        Commencer votre parcours
      </button>
    </section>
  );
};

export default Hero;
