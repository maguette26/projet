import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

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
      className="relative bg-gradient-to-br from-indigo-100 via-indigo-50 to-white px-6 py-28 text-center rounded-3xl max-w-6xl mx-auto shadow-lg overflow-hidden"
    >
      {/* Décorations animées */}
      <motion.div
        className="absolute top-10 left-10 text-indigo-300"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <HeartPulse size={80} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-extrabold text-indigo-900 mb-4 drop-shadow-md"
      >
        Bienvenue sur PsyConnect
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-indigo-700 text-lg max-w-xl mx-auto mb-12"
      >
        Votre espace de soutien et de ressources en santé mentale, accessible partout et en toute confidentialité.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(99,102,241,0.7)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition"
      >
        Inscrivez-vous plus accéder a pl
        <HeartPulse size={24} className="animate-pulse" />
      </motion.button>
    </motion.section>
  );
};

export default Hero;
