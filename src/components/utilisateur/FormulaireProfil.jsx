import React, { useState, useEffect } from 'react';
import { getProfil, modifierProfil } from '../../services/serviceUtilisateur';

const FormulaireProfil = () => {
    const [profil, setProfil] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Pour gérer les erreurs

    useEffect(() => {
        async function fetchProfil() {
            try {
                const data = await getProfil();
                if (data) setProfil(data);
            } catch (error) {
                console.error('Erreur chargement profil:', error);
                setError('Erreur lors du chargement de votre profil.');
            }
        }
        fetchProfil();
    }, []);

    const handleChange = (e) => {
        setProfil({ ...profil, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Réinitialiser les messages
        setError('');
        try {
            await modifierProfil(profil);
            setMessage('Profil mis à jour avec succès !');
        } catch (error) {
            setError('Erreur lors de la mise à jour du profil.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <div className="mb-3"> {/* Marge en bas pour chaque groupe label/input */}
                <label htmlFor="nom" className="form-label">Nom :</label>
                <input type="text" className="form-control" id="nom" name="nom" value={profil.nom} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="prenom" className="form-label">Prénom :</label>
                <input type="text" className="form-control" id="prenom" name="prenom" value={profil.prenom} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email :</label>
                <input type="email" className="form-control" id="email" name="email" value={profil.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="telephone" className="form-label">Téléphone :</label>
                <input type="tel" className="form-control" id="telephone" name="telephone" value={profil.telephone} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Enregistrer</button>
        </form>
    );
};

export default FormulaireProfil;