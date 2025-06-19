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
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <Layout>
      {/* Bouton Play/Pause en bas à droite */}
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
        className={`
          fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full
          bg-indigo-600 text-white shadow-lg transition
          ${autoScroll ? 'ring-4 ring-indigo-400 animate-pulse' : 'hover:bg-indigo-700'}
          focus:outline-none focus:ring-4 focus:ring-indigo-500
        `}
      >
        {autoScroll ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
      </button>

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
