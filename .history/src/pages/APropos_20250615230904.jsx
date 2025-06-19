import React from 'react';
 

const APropos = () => {
  return (
    <>
      <Heade />
      <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 mb-20">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          À propos de PsyConnect
        </h1>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
          PsyConnect est une plateforme innovante dédiée à la santé mentale. Nous facilitons la mise en relation entre les professionnels de santé mentale (psychologues, psychiatres) et les utilisateurs à la recherche d'un accompagnement adapté, confidentiel et accessible.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
          Notre mission est de rendre le soutien psychologique accessible à tous, où que vous soyez, grâce à une interface intuitive et sécurisée.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
          Que vous soyez un professionnel souhaitant proposer vos services ou un utilisateur en quête d'aide, PsyConnect vous accompagne tout au long de votre parcours.
        </p>
        <p className="text-gray-700 leading-relaxed text-lg">
          N'hésitez pas à parcourir nos ressources, participer à notre forum ou prendre rendez-vous avec un professionnel certifié.
        </p>
      </main>
    </>
  );
};

export default APropos;
