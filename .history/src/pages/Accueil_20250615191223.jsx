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
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <Layout>
      {/* Bouton lecture/pause */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition"
          aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
        >
          {autoScroll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {autoScroll ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Conteneur à défilement automatique */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
      >
        {/* Section Hero */}
        <section className="h-screen snap-start flex items-center justify-center bg-indigo-50">
          <Hero />
        </section>

        {/* Section Fonctionnalités */}
        <section className="h-screen snap-start flex items-center justify-center bg-white">
          <Fonctionnalites />
        </section>

        {/* Section PourquoiNous */}
        <section className="h-screen snap-start flex items-center justify-center bg-white">
         <PourquoiNous />
        </section>
      </div>
    </Layout>
  );
};

export default Accueil;
