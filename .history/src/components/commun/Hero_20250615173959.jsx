import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; // Icône lucide

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connexion');
  };

  return (
    <section className="bg-blue-50 py-16 px-6 rounded-2xl shadow-md text-center mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenue sur <span className="text-indigo-600">PsyConnect</span></h1>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Retrouvez des professionnels de santé mentale, des ressources utiles et une communauté bienveillante pour vous accompagner.
      </p>
      
    </section>
  );
};

export default Hero;
