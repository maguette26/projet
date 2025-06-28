import React, { useEffect, useState } from 'react';
import { getReservations, updateReservationStatus } from '../../services/servicePsy';
import { CheckCircle, XCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reservations = ({ proId }) => {
  const [reservations, setReservations] = useState([]);
  const [filtre, setFiltre] = useState('TOUTES');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservations(proId);
      setReservations(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des réservations.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (proId) {
      fetchReservations();
    } else {
      setLoading(false);
      setError("ID professionnel manquant.");
    }
  }, [proId]);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateReservationStatus(id, status);
      await fetchReservations();
      if (status === 'VALIDE') {
        toast.success("La réservation a été validée.");
      } else if (status === 'REFUSE') {
        toast.error("La réservation a été refusée.");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut.");
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setUpdatingId(null);
    }
  };

  const mapStatutValidation = (reservation) => {
    if (reservation.statut === 'PAYEE' || reservation.statut === 'EN_ATTENTE_PAIEMENT') {
      return 'VALIDE';
    }
    if (reservation.statut === 'REFUSE' || reservation.statut === 'ANNULEE') {
      return 'REFUSE';
    }
    return 'EN_ATTENTE';
  };

  const formatHeure = (heure) => {
    if (!heure) return '';
    const [h, m] = heure.split(':');
    return `${h}h${m}`;
  };

  const getStatutMessage = (statut) => {
    switch (statut) {
      case 'VALIDE':
        return <span className="text-green-600 font-semibold">Validée</span>;
      case 'REFUSE':
        return <span className="text-red-600 font-semibold">Refusée</span>;
      default:
        return <span className="text-gray-600 font-semibold">En attente</span>;
    }
  };

  const reservationsFiltrees = reservations.filter((r) =>
    filtre === 'TOUTES' ? true : mapStatutValidation(r) === filtre
  );

  const renderActions = (id, statut) => {
    const btnStyle = "p-0 m-0 bg-transparent border-none focus:outline-none hover:scale-110 transition-transform";

    switch (statut) {
      case 'EN_ATTENTE':
        return (
          <>
            <button
              onClick={() => handleUpdateStatus(id, 'VALIDE')}
              className={`${btnStyle} text-green-600`}
              title="Valider"
              disabled={updatingId === id}
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => handleUpdateStatus(id, 'REFUSE')}
              className={`${btnStyle} text-red-600`}
              title="Refuser"
              disabled={updatingId === id}
            >
              <XCircle size={20} />
            </button>
          </>
        );
      case 'VALIDE':
        return (
          <button
            onClick={() => handleUpdateStatus(id, 'REFUSE')}
            className={`${btnStyle} text-red-600`}
            title="Refuser"
            disabled={updatingId === id}
          >
            <XCircle size={20} />
          </button>
        );
      case 'REFUSE':
        return (
          <button
            onClick={() => handleUpdateStatus(id, 'VALIDE')}
            className={`${btnStyle} text-green-600`}
            title="Valider"
            disabled={updatingId === id}
          >
            <CheckCircle size={20} />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
        <CheckCircle size={24} /> Mes réservations
      </h2>

      {/* Erreur */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filtres */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {['TOUTES', 'EN_ATTENTE', 'VALIDE', 'REFUSE'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 ${
              filtre === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'TOUTES'
              ? 'Toutes'
              : f === 'EN_ATTENTE'
              ? 'En attente'
              : f === 'VALIDE'
              ? 'Validées'
              : 'Refusées'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-blue-600">Chargement...</p>
      ) : reservationsFiltrees.length === 0 ? (
        <p className="text-gray-500">Aucune réservation</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-primary-600">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Heure</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Utilisateur</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Statut</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reservationsFiltrees.map((reservation) => {
                const statutMapped = mapStatutValidation(reservation);
                const utilisateurNomPrenom = reservation.utilisateur
                  ? `${reservation.utilisateur.prenom || ''} ${reservation.utilisateur.nom || ''}`.trim()
                  : 'Utilisateur inconnu';

                return (
                  <tr key={reservation.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {new Date(reservation.dateReservation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2">
                      {formatHeure(reservation.heureConsultation)}
                    </td>
                    <td className="px-4 py-2">{utilisateurNomPrenom}</td>
                    <td className="px-4 py-2">{getStatutMessage(statutMapped)}</td>
                    <td className="px-4 py-2 flex gap-2">{renderActions(reservation.id, statutMapped)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Reservations;
