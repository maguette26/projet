import React from 'react';
import { ShieldCheck, Heart, Headphones } from 'lucide-react';

const points = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />,
    titre: "Confidentialité garantie",
    texte: "Vos données et vos échanges sont strictement confidentiels, protégés et sécurisés.",
  },
  {
    icon: <Heart className="h-8 w-8 text-indigo-600" />,
    titre: "Approche humaine",
    texte: "Notre mission est de vous accompagner avec bienveillance et respect.",
  },
  {
    icon: <Headphones className="h-8 w-8 text-indigo-600" />,
    titre: "Support réactif",
    texte: "Une équipe disponible pour vous aider à chaque étape.",
  },
];

const PourquoiNous = () => {
  return (
    <section className="mt-20 max-w-6xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Pourquoi choisir PsyConnect ?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {points.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex justify-center">{p.icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{p.titre}</h3>
            <p className="text-sm text-gray-600">{p.texte}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PourquoiNous; // ✅ Assure-toi que cette ligne est bien présente
