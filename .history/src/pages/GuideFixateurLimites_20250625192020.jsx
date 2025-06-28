// src/pages/GuideFixateurLimites.jsx
import React from 'react';
import Layout from '../components/commun/Layout';

const GuideFixateurLimites = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Guide : Fixateur des Limites Saines</h1>
        <p className="text-gray-800">Ce guide vous aidera à comprendre comment poser des limites saines dans vos relations et dans votre vie professionnelle.</p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
          <li><strong>Identifiez vos limites :</strong> Prenez conscience de ce que vous tolérez et ne tolérez pas.</li>
          <li><strong>Communiquez clairement :</strong> Exprimez vos besoins avec respect et fermeté.</li>
          <li><strong>Pratiquez le refus :</strong> Apprenez à dire non sans culpabiliser.</li>
          <li><strong>Respectez-vous :</strong> Mettez-vous en priorité pour préserver votre équilibre.</li>
          <li><strong>Évaluez régulièrement :</strong> Ajustez vos limites selon les contextes et les besoins.</li>
        </ul>
        <p className="mt-6 italic text-gray-600">Poser des limites, c'est s'affirmer avec bienveillance.</p>
      </div>
    </Layout>
  );
};

export default GuideFixateurLimites;