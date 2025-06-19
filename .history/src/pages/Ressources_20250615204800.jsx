import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';  // Import animation
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';

const Ressources = () => {
  // ... tes hooks et fonctions inchangés ...

  // Animation variants pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Titre centré */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center select-none">
          📚 Bibliothèque de Ressources
        </h1>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categoriesOrder.map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-5 py-2 rounded-full font-medium transition-colors duration-300
                ${selectedCategory === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
            >
              {/* Emoji à gauche selon catégorie (exemple basique) */}
              {key === 'citation' && '💬 '}
              {key === 'video' && '🎥 '}
              {key === 'podcast' && '🎧 '}
              {key === 'all' && '📚 '}
              {title}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : (
          <>
            {/* Section ressources gratuites */}
            {gratuits.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2 select-none">
                  ✨ Ressources Gratuites
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gratuits.map(f => (
                    <motion.div
                      key={f.id}
                      className="bg-white rounded-lg shadow p-5 border border-gray-200 cursor-pointer"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg">{f.nom}</h3>
                      </div>
                      {renderResourceContent(f)}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Section ressources premium */}
            {premiums.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 border-b border-yellow-400 pb-2 text-yellow-700 flex items-center gap-2 select-none">
                  ⭐ Ressources Premium
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiums.map(f => (
                    <motion.div
                      key={f.id}
                      className="bg-yellow-50 rounded-lg shadow border border-yellow-300 p-5 cursor-pointer"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg">{f.nom}</h3>
                        <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full select-none">
                          🔒 Premium
                        </span>
                      </div>
                      {renderResourceContent(f)}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Ressources;
