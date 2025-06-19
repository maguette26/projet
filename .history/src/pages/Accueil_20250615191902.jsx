import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const Accueil = () => {
  const containerRef = useRef(null);
  const sections = [<Hero />, <Fonctionnalites />, <PourquoiNous />];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto défilement
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sections.length;
      containerRef.current?.children[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(nextIndex);
    }, 7000);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex]);

  // Suivi du scroll manuel
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = containerRef.current?.scrollTop || 0;
      const height = containerRef.current?.clientHeight || 1;
      const newIndex = Math.round(scrollTop / height);
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    };

    containerRef.current?.addEventListener('scroll', onScroll);
    return () => containerRef.current?.removeEventListener('scroll', onScroll);
  }, [currentIndex]);

  return (
    <Layout>
      {/* Bouton lecture/pause */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
        >
          {autoScroll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {autoScroll ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Pagination par points */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              containerRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth' });
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full border-2 transition ${
              index === currentIndex ? 'bg-indigo-600 border-indigo-600 scale-125' : 'border-gray-400 bg-white'
            }`}
          />
        ))}
      </div>

      {/* Conteneur principal */}
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
