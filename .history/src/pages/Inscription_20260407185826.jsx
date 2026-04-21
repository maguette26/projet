// src/pages/Inscription.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/commun/Layout';
import { UserPlus, Stethoscope } from 'lucide-react';

const Inscription = () => {
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-white px-4 py-12">
                <div className="w-full max-w-xl bg-white/60 backdrop-blur-lg shadow-2xl rounded-3xl p-10">
                    <h2 className="text-center text-4xl font-bold text-blue-700 mb-4">Inscription à PsyConnect</h2>
                    <p className="text-center text-gray-700 mb-8">
                        Choisissez le type de compte qui vous correspond.
                    </p>

                    <div className="space-y-6">
                        <Link
                            to="/inscription/utilisateur"
                            className="flex items-center justify-center gap-3 w-full px-6 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-300 shadow-lg transform hover:-translate-y-1 hover:scale-105"
                        >
                            <UserPlus className="w-6 h-6" />
                            Je suis un Utilisateur
                        </Link>

                        <Link
                            to="/inscription/professionnel"
                            className="flex items-center justify-center gap-3 w-full px-6 py-4 text-lg font-semibold text-blue-700 border border-blue-600 bg-white hover:bg-blue-50 rounded-xl transition duration-300 shadow-lg transform hover:-translate-y-1 hover:scale-105"
                        >
                            <Stethoscope className="w-6 h-6" />
                            Je suis un Professionnel de Santé Mentale
                        </Link>
                    </div>

                    <div className="text-sm text-center mt-8 text-gray-700">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="text-blue-600 font-semibold hover:underline">
                            Connectez-vous ici
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Inscription;