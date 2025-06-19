import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sections = [Hero, Fonctionnalites, PourquoiNous];

const Accueil = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sections.length;
      if (containerRef.current) {
        containerRef.current.children[nextIndex].scrollIntoView({ behavior: 'smooth' });
      }
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex]);

  // Update index on manual scroll
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
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full text-white shadow hover:bg-indigo-700 transition"
        aria-label={autoScroll ? 'Pause auto scroll' : 'Play auto scroll'}
      >
        {autoScroll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        {autoScroll ? 'Pause' : 'Play'}
      </button>

      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {sections.map((Section, index) => (
          <motion.section
            key={index}
            className="snap-start h-screen flex items-center justify-center px-6 sm:px-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <Section />
          </motion.section>
        ))}
      </div>
    </Layout>
  );
};

export default Accueil;
