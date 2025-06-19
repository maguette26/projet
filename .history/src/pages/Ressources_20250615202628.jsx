// src/pages/Ressources.jsx
import React, { useState, useMemo, useContext, createContext } from 'react';
import { FaCrown } from 'react-icons/fa';

// === Contexte pour catégorie ===
const RessourceContext = createContext();

export const useRessource = () => {
  const context = useContext(RessourceContext);
  if (!context) throw new Error('useRessource doit être utilisé dans un RessourceProvider');
  return context;
};

export const RessourceProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categoriesOrder = useMemo(() => ([
    { key: 'all', title: 'Toutes les catégories' },
    { key: 'citation', title: 'Citations Inspirantes' },
    { key: 'article', title: 'Articles Éducatifs' },
    { key: 'guide_pratique', title: 'Guides Pratiques' },
    { key: 'journaling_prompt', title: 'Prompts de Journaling' },
    { key: 'exercice_texte', title: 'Exercices de Relaxation (texte)' },
    { key: 'video', title: 'Vidéos de Relaxation et Exercices' },
    { key: 'podcast', title: 'Podcasts Bien-être' },
    { key: 'outil', title: 'Outils Interactifs' },
    { key: 'challenge', title: 'Défis Bien-être' },
    { key: 'Autres', title: 'Autres' }
  ]), []);

  return (
    <RessourceContext.Provider value={{ selectedCategory, setSelectedCategory, categoriesOrder }}>
      {children}
    </RessourceContext.Provider>
  );
};

// === Composant principal ===
const Ressources = ({ fonctionnalites }) => {
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

  // Etats recherche, filtre et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPremium, setFilterPremium] = useState('all'); // 'all' | 'premium' | 'free'
  const [sortOrder, setSortOrder] = useState('date_desc'); // 'date_desc' | 'date_asc'

  // Fonction de filtrage, tri et groupement
  const filteredAndGroupedFonctionnalites = useMemo(() => {
    // Filtrage
    let filtered = fonctionnalites.filter(f => {
      const categoryMatch = selectedCategory === 'all' ||
        (selectedCategory === 'Autres' && !categoriesOrder.some(cat => cat.key === f.type)) ||
        f.type === selectedCategory;

      const searchMatch = f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const premiumMatch = filterPremium === 'all' ||
        (filterPremium === 'premium' && f.premium) ||
        (filterPremium === 'free' && !f.premium);

      return categoryMatch && searchMatch && premiumMatch;
    });

    // Tri par date (champ createdAt supposé en ISO string ou Date)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === 'date_asc' ? dateA - dateB : dateB - dateA;
    });

    // Groupement par catégorie
    const groups = {};
    filtered.forEach(f => {
      const typeKey = f.type || 'Autres';
      if (!groups[typeKey]) groups[typeKey] = [];
      groups[typeKey].push(f);
    });

    // Tri des clés par ordre dans categoriesOrder
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const indexA = categoriesOrder.findIndex(cat => cat.key === a);
      const indexB = categoriesOrder.findIndex(cat => cat.key === b);
      return (indexA === -1 ? categoriesOrder.length : indexA) - (indexB === -1 ? categoriesOrder.length : indexB);
    });

    // Création de l'objet trié
    return sortedKeys.reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [fonctionnalites, selectedCategory, searchTerm, filterPremium, sortOrder, categoriesOrder]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Ressources PsyConnect</h1>

      {/* Sélection catégorie */}
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {categoriesOrder.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === cat.key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Barre de recherche + filtre + tri */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Rechercher une ressource..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 max-w-xs focus:outline-indigo-500"
        />

        <select
          value={filterPremium}
          onChange={e => setFilterPremium(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
          aria-label="Filtrer par accès"
        >
          <option value="all">Toutes</option>
          <option value="premium">Premium</option>
          <option value="free">Gratuites</option>
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
          aria-label="Trier par date"
        >
          <option value="date_desc">Date décroissante</option>
          <option value="date_asc">Date croissante</option>
        </select>
      </div>

      {/* Affichage par catégorie */}
      {Object.entries(filteredAndGroupedFonctionnalites).length === 0 ? (
        <p className="text-center text-gray-500">Aucune ressource trouvée.</p>
      ) : (
        Object.entries(filteredAndGroupedFonctionnalites).map(([catKey, ressources]) => {
          const catTitle = categoriesOrder.find(cat => cat.key === catKey)?.title || catKey;
          return (
            <div key={catKey} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 border-b border-indigo-300 pb-1">{catTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ressources.map(r => (
                  <div
                    key={r.id}
                    className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                    title={r.description || ''}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{r.nom}</h3>
                      {r.premium && (
                        <span title="Accès Premium" className="text-yellow-500">
                          <FaCrown />
                        </span>
                      )}
                    </div>
                    {r.description && <p className="text-gray-600 text-sm">{r.description}</p>}
                    {/* Ajoute ici un lien ou un bouton si nécessaire */}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// === Exemple d'utilisation ===
// Enveloppe ton App ou la page par RessourceProvider
// Puis passe une liste de ressources au composant Ressources

const ressourcesExample = [
  {
    id: 1,
    nom: "Citation zen",
    description: "Une belle citation pour méditer.",
    type: "citation",
    premium: false,
    createdAt: "2025-05-01T10:00:00Z"
  },
  {
    id: 2,
    nom: "Guide pour gérer le stress",
    description: "Un guide pratique complet.",
    type: "guide_pratique",
    premium: true,
    createdAt: "2025-06-01T09:30:00Z"
  },
  {
    id: 3,
    nom: "Podcast bien-être mental",
    description: "Écoutez nos experts.",
    type: "podcast",
    premium: false,
    createdAt: "2025-04-20T08:00:00Z"
  },
  {
    id: 4,
    nom: "Vidéo relaxation",
    description: "Exercices de respiration.",
    type: "video",
    premium: false,
    createdAt: "2025-06-10T15:45:00Z"
  },
  {
    id: 5,
    nom: "Ressource inconnue",
    description: "Catégorie non listée",
    type: "inconnue",
    premium: false,
    createdAt: "2025-05-15T12:00:00Z"
  }
];

// Le composant parent
export default function App() {
  return (
    <RessourceProvider>
      <Ressources fonctionnalites={ressourcesExample} />
    </RessourceProvider>
  );
}
