// src/pages/Forum.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout'; 
import { 
    getForumSujets, 
    creerForumSujet, 
    getProfil, 
    getForumReponses, 
    envoyerForumReponse,
    modifierForumSujet,    
    supprimerForumSujet,   
    modifierForumReponse,  
    supprimerForumReponse  
} from '../services/serviceUtilisateur';
import { 
    MessageSquare, 
    Clock, 
    User, 
    UserCircle2, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    Send, 
    Plus, 
    Check, 
    X 
} from 'lucide-react';

// Fonction utilitaire pour obtenir l'initiale de l'auteur pour l'avatar
const getAuthorInitial = (author, isAnonymous) => {
    if (isAnonymous) return 'A';
    if (author?.nom) return author.nom.charAt(0).toUpperCase();
    if (author?.prenom) return author.prenom.charAt(0).toUpperCase();
    if (author?.email) return author.email.charAt(0).toUpperCase();
    return '?';
};

// Fonction utilitaire pour formater le temps de manière relative
const formatRelativeTime = (dateTimeString) => {
    if (!dateTimeString) return 'Date inconnue';
    const date = new Date(dateTimeString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `il y a ${days}j`;
    const months = Math.floor(days / 30);
    if (months < 12) return `il y a ${months}mois`;
    const years = Math.floor(months / 12);
    return `il y a ${years}an${years > 1 ? 's' : ''}`;
};

const Forum = () => {
    // [Tous les états existants restent les mêmes...]

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Forum Communautaire
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            Échangez avec la communauté
                        </p>
                    </div>

                    {/* Messages d'erreur/succès */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                            <X className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
                            <Check className="w-5 h-5 mr-2" />
                            {successMessage}
                        </div>
                    )}

                    {selectedTopic ? (
                        /* Vue détaillée d'un sujet */
                        <div className="space-y-6">
                            {/* Bouton retour */}
                            <button
                                onClick={handleBackToList}
                                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Retour aux discussions
                            </button>

                            {/* Carte du sujet principal */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {editingSujetId === selectedTopic.id ? (
                                    <form onSubmit={handleUpdateSujet} className="p-6 space-y-4">
                                        <h2 className="text-xl font-bold text-gray-800">Modifier le sujet</h2>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                            <input
                                                type="text"
                                                value={editingSujetTitre}
                                                onChange={(e) => setEditingSujetTitre(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                                            <textarea
                                                rows="4"
                                                value={editingSujetContenu}
                                                onChange={(e) => setEditingSujetContenu(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditingSujetId(null)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {getAuthorInitial(selectedTopic.auteur, selectedTopic.anonyme)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center text-sm space-x-2">
                                                    <span className="font-medium text-gray-900 truncate">
                                                        {getAuthorDisplayName(selectedTopic.auteur, selectedTopic.anonyme)}
                                                    </span>
                                                    <span className="text-gray-500 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {formatRelativeTime(selectedTopic.dateCreation)}
                                                    </span>
                                                </div>
                                                <h2 className="mt-1 text-xl font-bold text-gray-900">
                                                    {selectedTopic.titre}
                                                </h2>
                                                <p className="mt-2 text-gray-600 whitespace-pre-line">
                                                    {selectedTopic.contenu}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions (modifier/supprimer) */}
                                        {(selectedTopic.auteur && (isAuthor(selectedTopic.auteur.email) || isAdmin()) && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-4">
                                                <button
                                                    onClick={() => handleEditSujetClick(selectedTopic)}
                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSujet(selectedTopic.id)}
                                                    className="text-red-600 hover:text-red-800 flex items-center text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        )};
                                    </div>
                                )}
                            </div>

                            {/* Section des réponses */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
                                    Réponses ({reponses.length})
                                </h3>

                                {loadingReponses ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                    </div>
                                ) : reponses.length === 0 ? (
                                    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                                        Aucune réponse pour le moment. Soyez le premier à répondre !
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reponses.map(reponse => (
                                            <div key={reponse.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                                {editingReponseId === reponse.id ? (
                                                    <form onSubmit={handleUpdateReponse} className="p-4">
                                                        <textarea
                                                            rows="3"
                                                            value={editingReponseMessage}
                                                            onChange={(e) => setEditingReponseMessage(e.target.value)}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            required
                                                        />
                                                        <div className="mt-2 flex justify-end space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingReponseId(null)}
                                                                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                                                            >
                                                                Annuler
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                            >
                                                                Enregistrer
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className="p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                                    {getAuthorInitial(reponse.auteur, reponse.anonyme)}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center text-sm space-x-2">
                                                                    <span className="font-medium text-gray-900">
                                                                        {getAuthorDisplayName(reponse.auteur, reponse.anonyme)}
                                                                    </span>
                                                                    <span className="text-gray-500 flex items-center">
                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                        {formatRelativeTime(reponse.dateReponse)}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-1 text-gray-600 whitespace-pre-line">
                                                                    {reponse.message}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Actions (modifier/supprimer) */}
                                                        {(reponse.auteur && (isAuthor(reponse.auteur.email) || isAdmin()) && (
                                                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-4">
                                                                <button
                                                                    onClick={() => handleEditReponseClick(reponse)}
                                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs"
                                                                >
                                                                    <Edit className="w-3 h-3 mr-1" />
                                                                    Modifier
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteReponse(reponse.id)}
                                                                    className="text-red-600 hover:text-red-800 flex items-center text-xs"
                                                                >
                                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Formulaire de réponse */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Ajouter une réponse</h4>
                                    {!isAuthenticated ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                            <p className="text-blue-800 mb-2">Connectez-vous pour participer à la discussion</p>
                                            <a 
                                                href="/connexion" 
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <UserCircle2 className="w-4 h-4 mr-2" />
                                                Se connecter
                                            </a>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitReponse} className="space-y-4">
                                            <textarea
                                                rows="4"
                                                placeholder="Écrivez votre réponse ici..."
                                                value={nouveauMessageReponse}
                                                onChange={(e) => setNouveauMessageReponse(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            <div className="flex items-center justify-between">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        checked={isReponseAnonyme}
                                                        onChange={(e) => setIsReponseAnonyme(e.target.checked)}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">Publier anonymement</span>
                                                </label>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Envoyer
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Vue liste des sujets */
                        <div className="space-y-6">
                            {/* Formulaire de création de sujet */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                                        Nouvelle discussion
                                    </h2>
                                    {!isAuthenticated ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                            <p className="text-blue-800 mb-2">Connectez-vous pour créer une nouvelle discussion</p>
                                            <a 
                                                href="/connexion" 
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <UserCircle2 className="w-4 h-4 mr-2" />
                                                Se connecter
                                            </a>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitSujet} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                                <input
                                                    type="text"
                                                    value={nouveauTitre}
                                                    onChange={(e) => setNouveauTitre(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Titre de votre discussion"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                                                <textarea
                                                    rows="4"
                                                    value={nouveauContenu}
                                                    onChange={(e) => setNouveauContenu(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Détaillez votre discussion ici..."
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        checked={isSujetAnonyme}
                                                        onChange={(e) => setIsSujetAnonyme(e.target.checked)}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">Publier anonymement</span>
                                                </label>
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Publier
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Liste des sujets */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
                                    Discussions récentes
                                </h2>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                                        <p className="mt-4 text-gray-500">Chargement des discussions...</p>
                                    </div>
                                ) : sujets.length === 0 ? (
                                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                        <MessageSquare className="w-10 h-10 mx-auto text-gray-400" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune discussion</h3>
                                        <p className="mt-2 text-gray-500">Soyez le premier à lancer une discussion !</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sujets.map(sujet => (
                                            <div 
                                                key={sujet.id} 
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => setSelectedTopic(sujet)}
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                                {getAuthorInitial(sujet.auteur, sujet.anonyme)}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center text-sm space-x-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {getAuthorDisplayName(sujet.auteur, sujet.anonyme)}
                                                                </span>
                                                                <span className="text-gray-500 flex items-center">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {formatRelativeTime(sujet.dateCreation)}
                                                                </span>
                                                            </div>
                                                            <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                                                {sujet.titre}
                                                            </h3>
                                                            <p className="mt-2 text-gray-600 line-clamp-2">
                                                                {sujet.contenu}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                                        <div className="flex items-center text-sm text-indigo-600">
                                                            <MessageSquare className="w-4 h-4 mr-1" />
                                                            {sujet.reponsesCount} réponse{sujet.reponsesCount !== 1 ? 's' : ''}
                                                        </div>

                                                        {(sujet.auteur && (isAuthor(sujet.auteur.email) || isAdmin())) && (
                                                            <div className="flex space-x-4">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditSujetClick(sujet);
                                                                    }}
                                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                                                                >
                                                                    <Edit className="w-4 h-4 mr-1" />
                                                                    Modifier
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteSujet(sujet.id);
                                                                    }}
                                                                    className="text-red-600 hover:text-red-800 flex items-center text-sm"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                                    Supprimer
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Forum;