import React from 'react';

const CarteRessourceEducative = ({ ressource }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
      <a href={ressource.lien} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#007bff', textDecoration: 'none' }}>
        {ressource.titre}
      </a>
    </div>
  );
};

export default CarteRessourceEducative;
