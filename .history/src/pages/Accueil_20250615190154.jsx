import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sectionsCount = 3;

const Accueil = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto scroll avec mise à jour index + scroll smooth
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
    }, 4500);

    return () => clearInterval(interval);
  }, [autoScroll]);

  // Mise à jour de currentIndex quand utilisateur scroll manuellement
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

  // Variants pour animation fade in des sections
  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <Layout>
      {/* Bouton sticky en haut à droite */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
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

      {/* Indicateur de section (bullets) */}
      <div className="fixed top-1/2 right-3 transform -translate-y-1/2 z-40 flex flex-col gap-3">
        {[...Array(sectionsCount)].map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la section ${i + 1}`}
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.children[i].scrollIntoView({ behavior: 'smooth' });
              }
              setCurrentIndex(i);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === i ? 'bg-indigo-600 scale-150' : 'bg-indigo-300'
            }`}
          />
        ))}
      </div>

      {/* Conteneur scroll vertical full screen */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {[Hero, Fonctionnalites, PourquoiNous].map((SectionComponent, index) => (
          <section
            key={index}
            className="snap-start h-screen flex flex-col justify-center px-6 sm:px-12"
            aria-label={`Section ${index + 1}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex === index ? 'visible' : 'hidden'}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-full max-w-4xl mx-auto"
              >
                <SectionComponent />
              </motion.div>
            </AnimatePresence>
          </section>
        ))}
      </div>
    </Layout>
  );
};

export default Accueil;
