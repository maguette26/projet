import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
