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
      className="relative bg-gradient-to-br from-indigo-100 via-indigo-50 to-white px-6 py-28 text-center rounded-3xl max-w-6xl mx-auto shadow-xl overflow-hidden"
    >
      {/* Décorations animées - floating */}
      <motion.div
        className="absolute top-12 left-12 text-indigo-300"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HeartPulse size={90} className="drop-shadow-md" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-6xl font-extrabold text-indigo-900 mb-4 drop-shadow-lg"
      >
        Bienvenue sur PsyConnect
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-indigo-700 text-lg max-w-xl mx-auto mb-16 leading-relaxed"
      >
        Votre espace de soutien et de ressources en santé mentale, accessible partout et en toute confidentialité.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="inline-flex items-center gap-3 bg-indigo-600 text-white px-12 py-4 rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition relative overflow-hidden"
      >
        Inscrivez-vous pour accéder à plusieurs fonctionnalités
        <motion.span
          className="absolute -right-6"
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <HeartPulse size={28} className="text-white drop-shadow animate-pulse" />
        </motion.span>
      </motion.button>
    </motion.section>
  );
};

export default Hero;
