

import React, { useState, useEffect } from 'react';

const quotes = [
  "La santé mentale n'est pas un luxe, c'est une nécessité.",
  "Chaque petit pas vers le bien-être est une victoire.",
  "Vous êtes plus fort que vous ne le pensez.",
  "Prendre soin de soi, c'est aussi prendre soin des autres.",
  "Il n'y a pas de honte à demander de l'aide.",
];

const Citations = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <section style={styles.section}>
      <blockquote style={styles.quote}>"{quote}"</blockquote>
    </section>
  );
};

const styles = {
  section: {
    margin: '3rem auto',
    maxWidth: '600px',
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  },
  quote: {
    fontSize: '1.5rem',
    borderLeft: '4px solid #4a90e2',
    paddingLeft: '1rem',
  },
};

export default Citations;
