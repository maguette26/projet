import React from 'react';

import PiedPage from '../components/commun/PiedPage';
import Header from '../components/header';

const Forum = () => {
  return (
    <>
       <Header />    <main style={{ padding: '20px' }}>
        <h1>Forum de discussion</h1>
        < ForumMessagess />
      </main>
      <PiedPage />
    </>
  );
};

export default Forum;
