import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const Accueil = () => {
  const containerRef = useRef(null);
  const sectionsCount = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sectionsCount;
        if (containerRef.current) {
          containerRef.current.children[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 4500); // Durée un peu plus longue pour meilleure lecture

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <Layout>
      {/* Bouton play/pause en haut à droite */}
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 px-3 py-1.5 rounded-full text-white shadow hover:bg-indigo-700 transition text-sm"
        aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
      >
        {autoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {autoScroll ? 'Pause' : 'Play'}
      </button>

      {/* Conteneur défilant */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
      >
        <section className="h-screen snap-start flex items-center justify-center bg-indigo-50">
          <Hero />
        </section>

        <section className="h-screen snap-start flex items-center justify-center bg-white">
          <Fonctionnalites />
        </section>

        <section className="h-screen snap-start flex items-center justify-center bg-white">
          <PourquoiNous />
        </section>
      </div>
    </Layout>
  );
};

export default Accueil;
