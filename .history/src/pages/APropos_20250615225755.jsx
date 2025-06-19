// src/pages/APropos.js
import React from 'react';

const APropos = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">À propos de PsyConnect</h1>

      <p className="text-gray-700 mb-4 leading-relaxed">
        PsyConnect est une plateforme innovante dédiée à la santé mentale. Nous facilitons la mise en relation entre les professionnels de santé mentale (psychologues, psychiatres) et les utilisateurs à la recherche d’un accompagnement adapté, confidentiel et accessible.
      </p>

      <p className="text-gray-700 mb-4 leading-relaxed">
        Notre objectif est de démocratiser l’accès aux soins psychologiques en proposant des consultations en ligne, un forum d’échange, ainsi que des ressources éducatives fiables pour accompagner chacun dans son parcours de bien-être mental.
      </p>

      <p className="text-gray-700 mb-4 leading-relaxed">
        PsyConnect se veut un espace sécurisé, respectueux et innovant, où la confidentialité et l’écoute sont au cœur de nos valeurs. Notre équipe est composée de professionnels engagés à offrir un service de qualité, accessible à tous.
      </p>

      <h2 className="text-2xl font-semibold text-indigo-700 mt-12 mb-4">Nos valeurs</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Confidentialité et respect de la vie privée</li>
        <li>Accessibilité et inclusion</li>
        <li>Professionnalisme et expertise</li>
        <li>Innovation technologique au service de la santé</li>
        <li>Écoute et bienveillance</li>
      </ul>

      <h2 className="text-2xl font-semibold text-indigo-700 mt-12 mb-4">Contact</h2>
      <p className="text-gray-700 leading-relaxed">
        Pour toute question ou suggestion, n’hésitez pas à nous contacter via notre page <a href="/contact" className="text-indigo-600 underline hover:text-indigo-800">Contact</a>.
      </p>
    </main>
  );
};

export default APropos;
