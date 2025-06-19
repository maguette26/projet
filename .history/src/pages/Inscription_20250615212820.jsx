// src/pages/Inscription.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Inscription = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Choisissez votre type d'inscription
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Pour bénéficier au mieux de notre plateforme, veuillez sélectionner le type de compte qui vous correspond.
                </p>

                <div className="mt-8 space-y-4">
                    <Link
                        to="/inscription/utilisateur"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Je suis un Utilisateur Simple
                    </Link>

                    <Link
                        to="/inscription/professionnel"
                        className="group relative w-full flex justify-center py-3 px-4 border border-indigo-600 text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Je suis un Professionnel de Santé Mentale
                    </Link>
                </div>

                <div className="text-sm text-center mt-6">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
                        Connectez-vous ici
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Inscription;