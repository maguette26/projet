import { FaCopyright } from 'react-icons/fa';

const PiedPage = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-200 text-indigo-700 text-center py-8 mt-24 shadow-inner">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3">
        <FaCopyright className="inline-block mr-1 text-sm" />
        <p className="text-sm font-light">
          2025 <span className="font-semibold">PsyConnect</span> - Tous droits réservés
        </p>
        <a
          href="https://psyconnect.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-300"
        >
          Visitez notre site
        </a>
      </div>
    </footer>
  );
};

export default PiedPage;
