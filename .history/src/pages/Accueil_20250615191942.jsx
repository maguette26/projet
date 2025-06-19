import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sections = [
  { component: Hero, label: '1' },
  { component: Fonctionnalites, label: '2' },
  { component: PourquoiNous, label: '3' },
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
          containerRef.current.children[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Barre de progression verticale */}
      <div className="fixed top-1/4 left-4 h-1/2 w-1 bg-gray-300 rounded-full overflow-hidden z-50">
        <div
          className="bg-indigo-600 w-full rounded-full transition-all duration-500"
          style={{ height: `${((currentIndex + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* Boutons ronds de navigation */}
      <div className="fixed top-1/4 left-10 flex flex-col gap-6 z-50">
        {sections.map(({ label }, index) => (
          <button
            key={index}
            onClick={() => {
              containerRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth' });
              setCurrentIndex(index);
            }}
            aria-label={`Aller à la section ${label}`}
            className={`
              w-10 h-10 rounded-full border-2 border-indigo-600 flex items-center justify-center
              text-indigo-600 font-semibold text-lg
              transition-transform duration-300
              ${index === currentIndex ? 'scale-110 bg-indigo-600 text-white shadow-lg' : 'bg-white hover:bg-indigo-100'}
              `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sections */}
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
