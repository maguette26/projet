import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
  // On peut renommer ou copier le composant pour l'adapter en page

const DisponibilitesPage = () => {
  const { proId } = useParams();
  const navigate = useNavigate();
  const [disponibilites, setDisponibilites] = useState([]);
  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisponibilites = async () => {
      try {
        setLoading(true);
        const resDisponibilites = await axios.get(`/api/disponibilites/${proId}`, { withCredentials: true });
        setDisponibilites(resDisponibilites.data);
        // Pour info du pro, tu peux soit passer l'objet via state lors de la navigation, soit recharger ici :
        const resPro = await axios.get(`/api/professionnels/${proId}`, { withCredentials: true });
        setPro(resPro.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des disponibilités.");
        navigate('/'); // Retour à la liste si erreur
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [proId, navigate]);

  // Le composant DisponibilitesModal attend un onClose (pour fermer le modal)
  // Ici on peut afficher directement son contenu en enlevant la partie modal,
  // Ou bien extraire son contenu dans un composant Présentation simple.

  if (loading) return <p className="text-center mt-20">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-700 font-semibold underline"
      >
        ← Retour à la liste des professionnels
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Disponibilités du Dr {pro?.prenom} {pro?.nom}
      </h1>

      {/* Ici tu peux réutiliser la logique de DisponibilitesModal mais sans le décor modal */}
      {/* Par exemple, tu peux extraire la partie affichage créneaux dans un composant à part, sinon coller le code ici */}
      {/* Je te recommande d'extraire l'affichage pour éviter la duplication */}

      {/* Exemple simplifié : */}
      {disponibilites.length === 0 ? (
        <p>Aucune disponibilité trouvée.</p>
      ) : (
        disponibilites.map((dispo, idx) => {
          // ... réutilise la fonction générerSousCreneaux et l'affichage ici
          // Pour gagner du temps, tu peux adapter la fonction et JSX de DisponibilitesModal sans les balises modal et animation
          return (
            <div key={idx} className="mb-8 border p-4 rounded shadow-sm">
              <p>{new Date(dispo.date).toLocaleDateString('fr-FR')}</p>
              <p>{dispo.heureDebut} - {dispo.heureFin}</p>
              {/* Boutons réserver, etc */}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DisponibilitesPage;
