import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 mémoire PAR utilisateur
const chatHistories = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message vide" });
  }

  // 🔥 init user memory
  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
Tu es PsyBot, un assistant psychologique empathique.

Ton rôle :
- écoute bienveillante
- réponses douces
- poser des questions ouvertes
- ne jamais être froid

Style :
- chaleureux
- phrases courtes
- emojis légers
      `,
    });

    const history = chatHistories[userId];

    // 🔥 ajouter user message
    history.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents: history,
    });

    const reply = result.response.text();

    // 🔥 ajouter réponse bot
    history.push({
      role: "model",
      parts: [{ text: reply }],
    });

    // 🔥 limite mémoire (évite explosion)
    if (history.length > 20) {
      history.splice(0, 4); // supprime ancien contexte
    }

    res.json({ reply });

  } catch (error) {
    console.log("❌ Erreur Gemini:", error?.message || error);

    if (error?.status === 429) {
      return res.status(200).json({
        reply:
          "⏳ Limite atteinte temporairement. Réessaie dans quelques instants 😊",
      });
    }

    return res.status(200).json({
      reply:
        "Je suis désolé 😢 je rencontre un problème technique.",
    });
  }
});

app.listen(5000, () =>
  console.log("✅ PsyBot Gemini multi-user stable lancé sur port 5000")
);