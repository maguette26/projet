import React from 'react';
import Header from '../components/commun/header';
import PiedPage from '../components/commun/PiedPage';

const APropos = () => {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 mb-20 font-sans">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 text-center">
          À propos de <span className="text-indigo-500">PsyConnect</span> 💡
        </h1>

        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          🧠 <strong>PsyConnect</strong> est une plateforme novatrice dédiée à la santé mentale. Elle permet de connecter les professionnels (psychologues, psychiatres) avec les personnes qui ont besoin d’un accompagnement humain, confidentiel et accessible à tout moment.
        </p>

        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          🌍 Dans un monde où les troubles psychologiques sont souvent négligés ou incompris, <strong>PsyConnect</strong> agit comme un pont vers l'écoute, la compréhension et la guérison. Parce que la santé mentale est essentielle, tout comme la santé physique.
        </p>

        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          💬 L'application propose un espace de parole libre : forums publics, discussions anonymes, et messagerie privée avec des professionnels pour celles et ceux qui n’osent pas encore parler à voix haute.
        </p>

        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          📚 Vous y trouverez aussi des ressources, des citations inspirantes et un suivi de votre humeur pour mieux comprendre votre état au quotidien.
        </p>

        <p className="text-gray-800 leading-relaxed text-lg">
          🤝 Rejoignez-nous dans cette mission humaine. Ensemble, brisons les tabous, construisons un monde plus à l’écoute, et faisons de la santé mentale une priorité pour tous. 💙
        </p>
      </main>
      <PiedPage />
    </>
  );
};

export default APropos;
