// src/components/CategorieFilter.jsx
import React from 'react';
import { useRessource } from '../pages/RessourceContext';

export default function CategorieFilter() {
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {categoriesOrder.map(cat => (
        <button
          key={cat.key}
          onClick={() => setSelectedCategory(cat.key)}
          className={`px-4 py-2 rounded-full border transition
            ${selectedCategory === cat.key
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-100'}`}
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
}
