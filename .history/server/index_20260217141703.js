import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let chatHistory = []; // ✅ mémoire serveur

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
Tu es PsyBot, un assistant psychologique empathique.

Ton rôle :
- écouter avec bienveillance
- répondre doucement comme un psychologue
- poser des questions ouvertes
- rassurer sans juger
- ne jamais être froid ou robotique

Style :
- chaleureux, humain, doux
- phrases courtes
- emojis légers si adapté

Si l'utilisateur dit "coucou", répond naturellement.
      `,
    });

    // ✅ ajouter message utilisateur dans la mémoire
    chatHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const result = await model.generateContent({
      contents: chatHistory,
    });

    const reply = result.response.text();

    // ✅ ajouter réponse du bot dans la mémoire
    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    res.json({ reply });
  } catch (error) {
    console.log("Erreur Gemini:", error);
    res.status(500).json({ reply: "Désolé, je rencontre un souci 😢" });
  }
});

app.listen(5000, () =>
  console.log("✅ PsyBot Gemini empathique lancé sur port 5000")
);
