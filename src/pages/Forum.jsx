import React from 'react';
import Layout from '../components/commun/Layout'; 


const Forum = () => {
  return (
   
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Forum de discussion</h1>
        <p className="text-gray-600">Contenu du forum sera affiché ici.</p>
      </div>
    </Layout>
  );
};

export default Forum;