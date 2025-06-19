import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const Accueil = () => {
  const containerRef = useRef(null);
  const sectionsCount = 3; // nombre total de sections
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true); // contrôle du scroll auto

  useEffect(() => {
    if (!autoScroll) return; // si pause, on ne fait rien

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
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
        >
          {autoScroll ? 'Pause' : 'Play'}
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
