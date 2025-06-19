import React from 'react';
 
import { useRessource } from '../../pages/RessourceContext.jsx';

const Header = () => {
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

  return (
    <NavbarAeroPlus
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      categoriesOrder={categoriesOrder}
    />
  );
};

export default Header;
