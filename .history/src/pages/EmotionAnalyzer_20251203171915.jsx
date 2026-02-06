// src/components/EmotionAnalyzer.jsx
import React, { useState } from "react";
import { FaSmile, FaFrown, FaMeh, FaAngry, FaSurprise, FaTired } from "react-icons/fa";

const emotionStyles = {
  joie: { color: "#FFD700", icon: <FaSmile /> },
  colère: { color: "#FF4500", icon: <FaAngry /> },
  tristesse: { color: "#1E90FF", icon: <FaFrown /> },
  peur: { color: "#8A2BE2", icon: <FaSurprise /> },
  stress: { color: "#FF69B4", icon: <FaTired /> },
  neutre: { color: "#808080", icon: <FaMeh /> },
};

const EmotionAnalyzer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEmotion = async () => {
    if (!text.trim()) {
      setError("Veuillez entrer un texte.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9191/api/ai/analyze-emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }), // <-- assure-toi d'envoyer 'message'
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse.");
      }

      const data = await response.json();
      const analysis = JSON.parse(data.analysis); // transforme la chaîne JSON en objet
      setResult(analysis);
    } catch (e) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Analyse Emotionnelle</h2>

      <textarea
        rows="5"
        placeholder="Écris ton texte ici…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={analyzeEmotion}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#4a6cff",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyse..." : "Analyser"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "10px",
            background: "#f4f4f4",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h3>Résultat :</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "2rem", color: emotionStyles[result.emotion_principale]?.color || "#000" }}>
              {emotionStyles[result.emotion_principale]?.icon}
            </span>
            <strong style={{ fontSize: "1.2rem", color: emotionStyles[result.emotion_principale]?.color || "#000" }}>
              {result.emotion_principale.toUpperCase()}
            </strong>
          </div>
          <p><strong>Valence :</strong> {result.valence}</p>
          <p><strong>Niveau d'intensité :</strong> {result.niveau_intensité}</p>
          <p><strong>Présence de détresse :</strong> {result.presence_detresse}</p>
        </div>
      )}
    </div>
  );
};

export default EmotionAnalyzer;
