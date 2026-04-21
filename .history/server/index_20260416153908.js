import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ mémoire PAR utilisateur
const chatHistories = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message vide" });
  }

  // ✅ créer mémoire utilisateur si inexistante
  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
Tu es PsyBot, un assistant psychologique empathique.

Rôle :
- écoute bienveillante
- réponses humaines
- questions ouvertes
- jamais froid

Style :
- phrases courtes
- ton doux
- emojis légers
      `,
    });

    const history = chatHistories[userId];

    // ✅ ajouter message user
    history.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents: history,
    });

    const reply = result.response.text();

    // ✅ ajouter réponse bot
    history.push({
      role: "model",
      parts: [{ text: reply }],
    });

    res.json({ reply });
  } catch (error) {
    console.log("Erreur Gemini:", error);
    res.status(500).json({
      reply: "Désolé, je rencontre un souci 😢",
    });
  }
});

app.listen(5000, () =>
  console.log("✅ PsyBot Gemini multi-user lancé sur port 5000")
);