import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';

const sectionsCount = 3;

const Accueil = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

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

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const maxIndex = sectionsCount - 1;
      const newIndex = Math.round(scrollTop / height);

      setCurrentIndex(newIndex);
      setCanScrollUp(scrollTop > 10); // un peu de marge
      setCanScrollDown(scrollTop < height * maxIndex - 10);
    };

    const refCurrent = containerRef.current;
    refCurrent?.addEventListener('scroll', onScroll);
    onScroll(); // pour init

    return () => refCurrent?.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToIndex = (index) => {
    if (containerRef.current && index >= 0 && index < sectionsCount) {
      containerRef.current.children[index]?.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  return (
    <Layout>
      {/* Bouton Play/Pause */}
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

      {/* Boutons scroll manuel plus petits et conditionnels */}
      <div className="fixed top-1/2 right-6 z-50 flex flex-col space-y-2 transform -translate-y-1/2">
        {canScrollUp && (
          <button
            onClick={() => {
              scrollToIndex(currentIndex === 0 ? 0 : currentIndex - 1);
              setAutoScroll(false);
            }}
            aria-label="Scroll up"
            className="p-2 rounded-full bg-indigo-100 bg-opacity-50 text-indigo-700 shadow-md hover:bg-opacity-80 hover:text-indigo-900 transition"
            style={{ width: 40, height: 40 }}
          >
            <ChevronUp size={20} />
          </button>
        )}

        {canScrollDown && (
          <button
            onClick={() => {
              scrollToIndex(currentIndex === sectionsCount - 1 ? currentIndex : currentIndex + 1);
              setAutoScroll(false);
            }}
            aria-label="Scroll down"
            className="p-2 rounded-full bg-indigo-100 bg-opacity-50 text-indigo-700 shadow-md hover:bg-opacity-80 hover:text-indigo-900 transition"
            style={{ width: 40, height: 40 }}
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>

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
