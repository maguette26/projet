import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
      className="bg-indigo-50 px-6 py-24 text-center rounded-2xl max-w-6xl mx-auto shadow-md"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-extrabold text-gray-800 mb-10"
      >
        Bienvenue sur PsyConnect
      </motion.h1>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow"
      >
        Commencer
      </motion.button>
    </motion.section>
  );
};

export default Hero;
