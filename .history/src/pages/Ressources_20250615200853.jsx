import React from 'react';
import { useRessource } from './RessourceContext';

const Ressources = () => {
  const { selectedCategory, setSelectedCategory, categoriesOrder, ressources } = useRessource();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">📚 Ressources de Bien-être</h1>

      {/* Boutons catégories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categoriesOrder.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${selectedCategory === cat.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'}`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Ressources filtrées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ressources
          .filter(r => selectedCategory === 'TOUS' || r.categorie === selectedCategory)
          .map(r => (
            <div key={r.id} className="bg-white p-4 shadow rounded border border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-700">{r.titre}</h3>
              <p className="text-sm text-gray-600 mt-2">{r.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Ressources;
