import React from 'react';
import { Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const DevenirPremiumCard = () => {
  const plans = {
    monthly: {
      label: 'Mensuel',
      price: 3,
      duration: 'mois',
      description: 'Annulez à tout moment.',
    },
    quarterly: {
      label: 'Trimestriel',
      price: 10,
      duration: '3 mois',
      description: 'Économisez 15%',
    },
    annually: {
      label: 'Annuel',
      price: 30,
      duration: 'an',
      description: 'Économisez 25%',
    },
  };

  return (
    <div className="absolute top-1/2 left-1/2 w-[180px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg border border-indigo-300 p-2 z-50">
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center gap-1 mb-1"
      >
        <Smile className="w-[10px] h-[10px] text-indigo-600 animate-pulse" />
        <h1 className="text-[8px] font-bold text-indigo-900 select-none">
          Premium <span className="text-indigo-700">+</span>
        </h1>
      </motion.div>

      <p className="text-[6px] text-center text-gray-600 font-medium px-1 mb-2 select-none">
        Débloquez les ressources exclusives : vidéos, podcasts, exercices...
      </p>

      <div className="space-y-1">
        {Object.entries(plans).map(([key, plan]) => (
          <div key={key} className="border-b last:border-none border-indigo-100 pb-[1px]">
            <p className="text-[7px] font-bold text-gray-800">
              {plan.label} : {plan.price.toFixed(2)} €
              <span className="text-[5px] text-gray-500"> / {plan.duration}</span>
            </p>
            <p className="text-[5px] text-gray-500 font-medium">{plan.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevenirPremiumCard;
<