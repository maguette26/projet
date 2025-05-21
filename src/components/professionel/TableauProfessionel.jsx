import React, { useEffect, useState } from 'react';
import { getDisponibilites, ajouterDisponibilite, modifierDisponibilite, supprimerDisponibilite } from '../services/servicePsy';
import FormulaireDisponibilite from './FormulaireDisponibilite';
import Messagerie from './Messagerie';

const TableauProfessionnel = () => {
  const [disponibilites, setDisponibilites] = useState([]);
  const [editingDispo, setEditingDispo] = useState(null); // dispo en édition ou null

  // Charger les dispos au montage
  useEffect(() => {
    fetchDisponibilites();
  }, []);

  const fetchDisponibilites = async () => {
    try {
      const data = await getDisponibilites();
      setDisponibilites(data);
    } catch (error) {
      console.error("Erreur chargement disponibilités", error);
    }
  };

  // Ajout ou modification d'une dispo
  const handleSaveDispo = async (dispoData) => {
    try {
      if (editingDispo) {
        // modifier
        await modifierDisponibilite(editingDispo.id, dispoData);
      } else {
        // ajouter
        await ajouterDisponibilite(dispoData);
      }
      setEditingDispo(null);
      fetchDisponibilites();
    } catch (error) {
      console.error("Erreur sauvegarde dispo", error);
    }
  };

  const handleEditDispo = (dispo) => {
    setEditingDispo(dispo);
  };

  const handleDeleteDispo = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await supprimerDisponibilite(id);
        fetchDisponibilites();
      } catch (error) {
        console.error("Erreur suppression dispo", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingDispo(null);
  };

  return (
    <div>
      <h1>Tableau de bord Professionnel</h1>

      <section>
        <h2>Gestion des disponibilités</h2>

        <FormulaireDisponibilite 
          onSubmit={handleSaveDispo} 
          disponibiliteInitiale={editingDispo} 
          onCancel={handleCancelEdit}
        />

        <h3>Liste des disponibilités</h3>
        {disponibilites.length === 0 ? (
          <p>Aucune disponibilité enregistrée.</p>
        ) : (
          <ul>
            {disponibilites.map(dispo => (
              <li key={dispo.id}>
                {dispo.date} : {dispo.heureDebut} - {dispo.heureFin}
                <button onClick={() => handleEditDispo(dispo)}>Modifier</button>
                <button onClick={() => handleDeleteDispo(dispo.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </section>
                  <section>
                             <h2>Messagerie</h2>
                                <Messagerie />
                   </section>

      {/* Section Messagerie sera ici */}
    </div>
  );
};

export default TableauProfessionnel;
