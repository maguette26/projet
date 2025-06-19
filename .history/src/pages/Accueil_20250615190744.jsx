import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';  // import icônes
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
          containerRef.current.children[nextIndex].scrollIntoView({
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
      <div className="flex justify-end max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
          aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
        >
          {autoScroll ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Play
            </>
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <section style={{ scrollSnapAlign: 'start' }} className="h-screen">
          <Hero />
        </section>

        <section style={{ scrollSnapAlign: 'start' }} className="h-screen overflow-auto">
          <Fonctionnalites />
        </section>

        <section style={{ scrollSnapAlign: 'start' }} className="h-screen overflow-auto">
          <PourquoiNous />
        </section>
      </div>
    </Layout>
  );
};

export default Accueil;
