import React from 'react';

const CarteCitation = ({ citation }) => {
  return (
    <blockquote style={{ fontStyle: 'italic', borderLeft: '4px solid #ccc', paddingLeft: '10px', margin: '10px 0' }}>
      “{citation.texte}”
      {citation.auteur && <footer style={{ textAlign: 'right', marginTop: '5px' }}>— {citation.auteur}</footer>}
    </blockquote>
  );
};

export default CarteCitation;
