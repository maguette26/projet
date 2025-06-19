import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sections = [<Hero key="hero" />, <Fonctionnalites key="fonc" />, <PourquoiNous key="pq" />];

const Accueil = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sections.length;
      scrollToSection(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex]);

  const scrollToSection = (index) => {
    if (containerRef.current && containerRef.current.children[index]) {
      containerRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentIndex(index);
    }
  };

  return (
    <Layout>
      {/* Bouton Lecture/Pause */}
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

      {/* Conteneur à défilement */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {sections.map((Component, index) => (
          <motion.section
            key={index}
            className="h-screen snap-start flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-6 sm:px-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <AnimatePresence>{Component}</AnimatePresence>
          </motion.section>
        ))}
      </div>
    </Layout>
  );
};

export default Accueil;
