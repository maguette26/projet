// 📄 src/pages/MiniDefiDecouverte.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MiniDefiDecouverte = () => {
  const [etape, setEtape] = useState(1);
  const [termine, setTermine] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (termine) {
      const timer = setTimeout(() => {
        navigate('/ressources');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [termine, navigate]);

  const nextStep = () => {
    if (etape === 3) setTermine(true);
    else setEtape(prev => prev + 1);
  };

  const prevStep = () => {
    setEtape(prev => Math.max(prev - 1, 1));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">🔍 Mini Défi Découverte</h1>
        {!termine ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {etape === 1 && (
              <div>
                <p className="text-gray-700 text-lg">Étape 1 : Respirez profondément pendant 2 minutes.</p>
                <button
                  onClick={nextStep}
                  className="mt-4 flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {etape === 2 && (
              <div>
                <p className="text-gray-700 text-lg">Étape 2 : Écrivez trois choses pour lesquelles vous êtes reconnaissant aujourd'hui.</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
                  >
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    Suivant <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {etape === 3 && (
              <div>
                <p className="text-gray-700 text-lg">Étape 3 : Faites une courte marche de 5 minutes à l’extérieur.</p>
                <div className="mt-4">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
                  >
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.p
            className="text-green-600 font-semibold text-lg animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Félicitations ! Vous avez complété le mini défi. Redirection vers les ressources...
          </motion.p>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiDecouverte;

