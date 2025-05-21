import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ← utilise l'instance avec interceptors

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("", { email, motDePasse });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setMessage("Connexion réussie !");

      // Redirection en fonction du rôle
      if (role === "ADMIN") navigate("/admin");
      else if (role === "UTILISATEUR") navigate("/utilisateur");
      else if (role === "PROFESSIONNEL") navigate("/professionnel");
      else navigate("/");
    } catch (error) {
      setMessage("Erreur : " + (error.response?.data?.message || "Connexion échouée"));
    }
  };

  return (
    <form onSubmit={handleConnexion} className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Connexion à PsyConnect</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        required
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
      >
        Se connecter
      </button>

      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes("réussie") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default Connexion;
