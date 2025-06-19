// src/pages/Ressources.jsx
import React, { useMemo } from 'react';
import { FaCrown } from 'react-icons/fa';
import { useRessource } from './RessourceContext'; // Ton contexte existant

export default function Ressources({ fonctionnalites }) {
  const { selectedCategory, categoriesOrder } = useRessource();

  // Filtrer et grouper par catégorie, puis séparer Premium / Gratuit
  const groupedFonctionnalites = useMemo(() => {
    // Filtrer par catégorie sélectionnée ou toutes
    const filtered = fonctionnalites.filter(f => 
      selectedCategory === 'all' || f.type === selectedCategory
    );

    // Grouper par catégorie
    const groups = {};
    filtered.forEach(f => {
      const cat = f.type || 'Autres';
      if (!groups[cat]) groups[cat] = { premium: [], free: [] };
      if (f.premium) groups[cat].premium.push(f);
      else groups[cat].free.push(f);
    });

    // Tri des catégories selon l'ordre défini
    const sortedGroups = {};
    categoriesOrder.forEach(cat => {
      if (groups[cat.key]) {
        sortedGroups[cat.key] = groups[cat.key];
      }
    });

    return sortedGroups;
  }, [fonctionnalites, selectedCategory, categoriesOrder]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {Object.keys(groupedFonctionnalites).length === 0 && (
        <p className="text-center text-gray-500">Aucune ressource trouvée pour cette catégorie.</p>
      )}

      {Object.entries(groupedFonctionnalites).map(([catKey, { free, premium }]) => {
        const catTitle = categoriesOrder.find(cat => cat.key === catKey)?.title || catKey;
        return (
          <section key={catKey} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b border-indigo-300 pb-1">{catTitle}</h2>

            {/* Liste GRATUITE */}
            {free.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Gratuit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {free.map(f => (
                    <div
                      key={f.id}
                      className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      title={f.description || ''}
                    >
                      <h4 className="font-semibold">{f.nom}</h4>
                      {f.description && <p className="text-gray-600 text-sm">{f.description}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Liste PREMIUM */}
            {premium.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Premium <FaCrown className="inline text-yellow-500 ml-1" title="Premium" /></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premium.map(f => (
                    <div
                      key={f.id}
                      className="border border-yellow-400 rounded-lg p-4 bg-yellow-50 hover:shadow-md transition cursor-pointer"
                      title={f.description || ''}
                    >
                      <h4 className="font-semibold">{f.nom}</h4>
                      {f.description && <p className="text-gray-600 text-sm">{f.description}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
