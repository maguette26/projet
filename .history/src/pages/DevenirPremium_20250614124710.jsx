// src/pages/DevenirPremium.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/commun/Layout';
import api from '../services/api'; // Votre instance Axios
import { useNavigate } from 'react-router-dom';

const DevenirPremium = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly'); // Plan sélectionné par défaut
    const navigate = useNavigate();

    // Définition des plans d'abonnement pour l'affichage (les prix réels seront déterminés par le backend)
    const plans = {
        monthly: { label: 'Mensuel', price: 9.99, duration: 'mois', description: 'Accès flexible, annulez à tout moment.' },
        quarterly: { label: 'Trimestriel', price: 24.99, duration: '3 mois', description: 'Économisez 15% par rapport au plan mensuel.' }, // Exemple de prix
        annually: { label: 'Annuel', price: 89.99, duration: 'an', description: 'La meilleure offre : économisez 25% !' }, // Exemple de prix
    };

    useEffect(() => {
        // Fonction pour charger le SDK PayPal
        const loadPayPalScript = () => {
            const paypalClientId = "YOUR_PAYPAL_CLIENT_ID_GOES_HERE"; // REMPLACER PAR VOTRE ID CLIENT PAYPAL
            if (!paypalClientId || paypalClientId === "YOUR_PAYPAL_CLIENT_ID_GOES_HERE") {
                setError("Erreur de configuration: ID Client PayPal non défini. Veuillez le remplacer dans DevenirPremium.jsx");
                setLoading(false);
                return;
            }

            const script = document.createElement('script');
            // La devise est importante ici, elle doit correspondre à celle configurée dans votre backend
            script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`; 
            script.onload = () => {
                setLoading(false); 
                renderPayPalButton(); // Rend le bouton PayPal une fois le SDK chargé
            };
            script.onerror = () => {
                setError("Impossible de charger le script PayPal. Veuillez vérifier votre connexion.");
                setLoading(false);
            };
            document.body.appendChild(script);
        };

        loadPayPalScript();

        // Nettoyage : retire le script si le composant est démonté
        return () => {
            const script = document.querySelector(`script[src^="https://www.paypal.com/sdk/js"]`);
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []); 

    // Re-rendre le bouton PayPal chaque fois que le plan sélectionné change
    useEffect(() => {
        // Supprime tous les boutons PayPal existants pour éviter les duplications
        const container = document.getElementById('paypal-button-container');
        if (container) {
            container.innerHTML = ''; 
        }
        if (!loading && window.paypal) { // S'assure que le SDK est chargé
            renderPayPalButton();
        }
    }, [selectedPlan, loading]); // Déclenche le rendu du bouton quand le plan ou le statut de chargement change

    // Fonction pour rendre le bouton PayPal
    const renderPayPalButton = () => {
        if (window.paypal) {
            window.paypal.Buttons({
                // Crée une commande PayPal sur votre backend
                createOrder: async (data, actions) => {
                    setError(null); 
                    try {
                        // Envoie le plan sélectionné au backend pour que le prix soit déterminé côté serveur
                        const response = await api.post('/paypal/create-order', { plan: selectedPlan });
                        const orderData = JSON.parse(response.data); 
                        return orderData.id; 
                    } catch (err) {
                        console.error("Erreur lors de la création de la commande:", err.response ? err.response.data : err.message);
                        setError(`Erreur lors de l'initialisation du paiement pour le plan ${plans[selectedPlan].label}. Veuillez réessayer.`);
                        return Promise.reject(err); 
                    }
                },
                // Capture le paiement sur votre backend une fois que l'utilisateur a approuvé
                onApprove: async (data, actions) => {
                    setError(null); 
                    try {
                        const response = await api.post(`/paypal/capture-order/${data.orderID}`);
                        const captureData = JSON.parse(response.data); 

                        if (captureData.status === 'COMPLETED') {
                            setSuccess(true);
                            localStorage.setItem('role', 'PREMIUM'); 
                            console.log('Paiement COMPLETED, utilisateur est maintenant PREMIUM.');
                            setTimeout(() => {
                                navigate('/tableauUtilisateur'); 
                            }, 3000); 
                        } else {
                            setError(`Paiement non complété. Statut: ${captureData.status}`);
                            console.error('Paiement non complété:', captureData);
                        }
                    } catch (err) {
                        console.error("Erreur lors de la capture de la commande:", err.response ? err.response.data : err.message);
                        setError("Erreur lors de la validation du paiement. Veuillez contacter le support.");
                    }
                },
                // Gère les annulations de paiement
                onCancel: (data) => {
                    console.log('Paiement annulé:', data);
                    setError("Le paiement a été annulé.");
                },
                // Gère les erreurs du SDK ou de l'intégration PayPal
                onError: (err) => {
                    console.error('Erreur PayPal SDK:', err);
                    setError("Une erreur est survenue avec PayPal. Veuillez réessayer ou utiliser une autre méthode.");
                }
            }).render('#paypal-button-container'); 
        }
    };

    const currentPlan = plans[selectedPlan];

    return (
        <Layout>
            <div className="py-8 px-4 max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-indigo-800 mb-6">Devenez Membre Premium !</h1>
                <p className="text-xl text-gray-700 mb-8">
                    Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées, podcasts experts, et bien plus encore.
                </p>

                <div className="bg-white p-8 rounded-lg shadow-xl border border-indigo-200">
                    <h2 className="text-3xl font-semibold text-indigo-700 mb-8">Choisissez votre plan d'abonnement</h2>
                    
                    {/* Sélecteur de plan */}
                    <div className="flex justify-center space-x-4 mb-10">
                        {Object.keys(plans).map((planKey) => (
                            <button
                                key={planKey}
                                onClick={() => setSelectedPlan(planKey)}
                                className={`
                                    px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300
                                    ${selectedPlan === planKey 
                                        ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {plans[planKey].label}
                            </button>
                        ))}
                    </div>

                    {/* Affichage du plan sélectionné */}
                    <div className="mb-8">
                        <p className="text-6xl font-extrabold text-gray-900 mb-2">
                            {currentPlan.price.toFixed(2)} $ <span className="text-xl text-gray-500">/ {currentPlan.duration}</span>
                        </p>
                        <p className="text-lg text-gray-600">{currentPlan.description}</p>
                    </div>

                    {loading ? (
                        <div className="text-center text-indigo-600 font-semibold text-lg">Chargement du bouton de paiement...</div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    ) : success ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            Paiement réussi ! Vous êtes maintenant membre Premium. Redirection...
                        </div>
                    ) : (
                        <div id="paypal-button-container" className="mt-6 w-full max-w-sm mx-auto">
                            {/* Le bouton PayPal sera rendu ici par le SDK */}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default DevenirPremium;
