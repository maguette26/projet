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
      className="bg-indigo-100 border-4 border-indigo-300 px-12 py-32 text-center rounded-3xl max-w-7xl mx-auto shadow-2xl"
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
        className="bg-indigo-600 text-white px-10 py-4 rounded-full hover:bg-indigo-700 transition shadow-lg text-lg"
      >
        Commencer
      </motion.button>
    </motion.section>
  );
};

export default Hero;
