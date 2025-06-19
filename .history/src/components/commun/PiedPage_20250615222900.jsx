/**
 * Composant PiedPage - Pied de page simple et élégant
 * Utilise Tailwind CSS pour le style
 */
const PiedPage = () => {
  return (
    <footer
      className="
        bg-indigo-50       /* Fond très clair violet */
        text-indigo-600     /* Texte violet moyen */
        text-center         /* Centrer le texte horizontalement */
        py-6                /* Padding vertical (haut/bas) */
        mt-24               /* Marge haute pour séparer du contenu au-dessus */
        select-none         /* Empêche la sélection du texte */
        "
      aria-label="Pied de page"
    >
      <p className="text-sm font-medium">
        &copy; 2025 PsyConnect. Tous droits réservés.
      </p>
    </footer>
  );
};

export default PiedPage;
