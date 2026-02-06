import React, { useState } from "react";

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
        body: JSON.stringify({ message: text }), // <-- clé "message" correspond au backend
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse.");
      }

      const data = await response.json();

      // Si le backend renvoie encore une chaîne JSON, on la parse
      const analysis = typeof data.analysis === "string" ? JSON.parse(data.analysis) : data.analysis;

      setResult(analysis);
    } catch (e) {
      setError("Une erreur est survenue lors de l'analyse.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
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
            padding: "15px",
            borderRadius: "10px",
            background: "#f4f4f4",
          }}
        >
          <h3>Résultat :</h3>
          <p><strong>Émotion principale :</strong> {result.emotion_principale}</p>
          <p><strong>Valence :</strong> {result.valence}</p>
          <p><strong>Niveau intensité :</strong> {result.niveau_intensité}</p>
          <p><strong>Présence détresse :</strong> {result.presence_detresse}</p>
        </div>
      )}
    </div>
  );
};

export default EmotionAnalyzer;
