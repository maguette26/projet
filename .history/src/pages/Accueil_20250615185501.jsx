import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import PourquoiNous from '../components/commun/PourquoiNous';
import Loader from '../components/commun/Loader';

const Accueil = () => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const sectionsCount = 3; // nombre total de sections
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll automatique toutes les 4 secondes
  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
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
