// src/components/Hero.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/connexion');

    
  };


  

  return (
    <section style={styles.hero}>
      <h1 style={styles.title}>Bienvenue sur PsyConnect</h1>
      <p style={styles.subtitle}>
        Retrouvez des professionnels, des ressources, et une communauté bienveillante.
      </p>
      <button onClick={handleClick} style={styles.button}>
        Commencer
      </button>
    </section>
  );
};

const styles = {
  hero: {
    backgroundColor: '#e6f0ff',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderRadius: '8px',
    margin: '2rem auto',
    maxWidth: '800px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#555',
  },
  button: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Hero;
