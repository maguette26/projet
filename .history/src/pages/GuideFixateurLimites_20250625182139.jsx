// src/pages/GuideFixateurLimites.jsx
import React from 'react';
import Layout from '../components/commun/Layout';

const GuideFixateurLimites = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Guide : Fixateur des Limites Saines</h1>
        <p>Ce guide vous aidera à comprendre comment poser des limites saines dans vos relations et dans votre vie professionnelle.</p>
        <ol className="list-decimal list-inside mt-4 space-y-3">
          <li><strong>Identifiez vos limites :</strong> Prenez conscience de ce que vous tolérez et ne tolérez pas.</li>
          <li><strong>Communiquez clairement :</strong> Exprimez vos besoins et limites avec respect et fermeté.</li>
          <li><strong>Pratiquez le refus :</strong> Apprenez à dire non sans culpabiliser.</li>
          <li><strong>Respectez-vous :</strong> Prenez soin de votre bien-être avant tout.</li>
          <li><strong>Évaluez régulièrement :</strong> Réajustez vos limites au besoin.</li>
        </ol>
        <p className="mt-6 italic text-gray-600">Prendre soin de soi commence par se respecter.</p>
      </div>
    </Layout>
  );
};

export default GuideFixateurLimites;
