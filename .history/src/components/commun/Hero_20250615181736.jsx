import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Ajoute ça si ce n’est pas déjà importé

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connexion');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-indigo-50 p-12 text-center rounded-xl max-w-3xl mx-auto shadow-sm"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenue sur PsyConnect</h1>
      <p className="text-lg text-gray-600 mb-6">
        Retrouvez des professionnels, des ressources, et une communauté bienveillante.
      </p>
      <button
        onClick={handleClick}
        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
      >
        Commencer
      </button>
    </motion.section>
  );
};

export default Hero;
