import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sections = [
  { component: Hero, label: 'Accueil' },
  { component: Fonctionnalites, label: 'Fonctionnalités' },
  { component: PourquoiNous, label: 'Pourquoi Nous' },
];

const Accueil = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sections.length;
        if (containerRef.current) {
          containerRef.current.children[nextIndex]?.scrollIntoView({
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / height);
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    };

    containerRef.current?.addEventListener('scroll', onScroll);
    return () => containerRef.current?.removeEventListener('scroll', onScroll);
  }, [currentIndex]);

  return (
    <Layout>
      {/* Bouton pause/play */}
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full text-white shadow hover:bg-indigo-700 transition"
        aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
      >
        {autoScroll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        {autoScroll ? 'Pause' : 'Play'}
      </button>

      {/* Boutons de navigation verticale avec labels */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3">
        {sections.map(({ label }, index) => (
          <button
            key={index}
            onClick={() => {
              containerRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth' });
              setCurrentIndex(index);
            }}
            aria-label={`Aller à la section ${label}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                index === currentIndex
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
              }
              cursor-pointer
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Conteneur à défilement automatique */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {sections.map(({ component: Section }, index) => (
          <section
            key={index}
            className={`h-screen snap-start flex items-center justify-center ${
              index === 0 ? 'bg-indigo-50' : 'bg-white'
            }`}
          >
            <Section />
          </section>
        ))}
      </div>
    </Layout>
  );
};

export default Accueil;
