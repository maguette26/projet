import React from 'react';

import ModerationDiscussions from '../components/admin/ModerationDiscussions';

const TableauAdmin = () => {
  return (
    <div>
      <h1>Tableau de bord Admin</h1>
      <GestionCitations />
      <GestionRessources />
         <ModerationDiscussions />
    </div>
  );
};

export default TableauAdmin;
