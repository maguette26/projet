import React, { useEffect, useState, useRef } from 'react';
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
      {/* Barre de navigation verticale à gauche */}
      <div className="fixed top-1/4 left-4 h-1/2 w-4 bg-gray-300 rounded-full overflow-hidden z-50 cursor-pointer flex flex-col justify-between p-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            onClick={() => {
              containerRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth' });
              setCurrentIndex(i);
            }}
            className={`flex-1 rounded my-1 transition-colors ${
              i === currentIndex ? 'bg-indigo-600' : 'bg-indigo-300 hover:bg-indigo-500'
            }`}
          />
        ))}
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
