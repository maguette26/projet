import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, BookOpenText } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connexion');
  };

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
      title: "Soutien Psychologique",
      desc: "Discutez avec des psychologues ou psychiatres qualifiés dans un espace sécurisé."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Communauté Bienveillante",
      desc: "Participez au forum, échangez anonymement avec d'autres utilisateurs."
    },
    {
      icon: <BookOpenText className="w-8 h-8 text-indigo-600" />,
      title: "Ressources Éducatives",
      desc: "Explorez des articles, vidéos et fiches pratiques sur la santé mentale."
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-indigo-50 px-6 py-16 text-center rounded-2xl max-w-6xl mx-auto shadow-md"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-extrabold text-gray-800 mb-6"
      >
        Bienvenue sur PsyConnect
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
      >
        Retrouvez des professionnels, des ressources, et une communauté bienveillante pour vous accompagner.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.2 }}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

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
