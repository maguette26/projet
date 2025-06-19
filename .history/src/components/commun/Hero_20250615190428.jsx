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
      className="h-screen bg-indigo-50 flex flex-col justify-center items-center text-center px-4 sm:px-8"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl sm:text-6xl font-extrabold text-gray-800 mb-8 leading-tight"
      >
        Bienvenue sur <br className="sm:hidden" /> <span className="text-indigo-600">PsyConnect</span>
      </motion.h1>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg text-lg"
      >
        Commencer
      </motion.button>
    </motion.section>
  );
};

export default Hero;
