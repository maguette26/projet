// 📄 src/pages/GuideFixateurLimites.jsx
import React from 'react';
import Layout from '../components/commun/Layout';
import { ShieldCheck, MessageSquare, Slash, UserCheck, RefreshCcw } from 'lucide-react';

const GuideFixateurLimites = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">🛡️ Guide : Fixer des Limites Saines</h1>
        <p className="text-gray-800">Ce guide vous aide à poser des limites saines dans vos relations et votre vie pro.</p>
        <ul className="list-disc list-inside mt-4 space-y-3 text-indigo-900">
          <li><ShieldCheck className="inline w-5 h-5 mr-1 text-indigo-600" /> <strong>Identifiez vos limites :</strong> ce que vous acceptez ou non.</li>
          <li><MessageSquare className="inline w-5 h-5 mr-1 text-indigo-600" /> <strong>Communiquez clairement :</strong> exprimez vos besoins calmement.</li>
          <li><Slash className="inline w-5 h-5 mr-1 text-indigo-600" /> <strong>Pratiquez le non :</strong> apprenez à dire non sans culpabiliser.</li>
          <li><UserCheck className="inline w-5 h-5 mr-1 text-indigo-600" /> <strong>Respectez-vous :</strong> vous êtes votre priorité.</li>
          <li><RefreshCcw className="inline w-5 h-5 mr-1 text-indigo-600" /> <strong>Réévaluez :</strong> vos limites peuvent évoluer.</li>
        </ul>
        <p className="mt-6 italic text-gray-600">💡 Poser des limites, c'est s'affirmer avec bienveillance.</p>
      </div>
    </Layout>
  );
};

export default GuideFixateurLimites;