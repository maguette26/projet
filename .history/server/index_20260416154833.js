import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 mémoire par utilisateur
const chatHistories = {};

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ reply: "Requête invalide" });
  }

  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
Tu es PsyBot, un assistant psychologique empathique.

- écoute bienveillante
- réponses courtes et humaines
- questions ouvertes
- jamais froid
- emojis légers si utile
      `,
    });

    const history = chatHistories[userId];

    history.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents: history,
    });

    const reply = result.response.text();

    history.push({
      role: "model",
      parts: [{ text: reply }],
    });

    // 🔥 limiter mémoire
    if (history.length > 20) {
      history.splice(0, 4);
    }

    return res.json({ reply });

  } catch (error) {
    console.log("❌ Gemini error:", error?.message || error);

    if (error?.status === 429) {
      return res.json({
        reply: "⏳ Limite atteinte, réessaie dans quelques secondes 😊",
      });
    }

    return res.json({
      reply: "Je rencontre un problème technique 😢",
    });
  }
});

app.listen(5000, () =>
  console.log("✅ PsyBot backend stable lancé sur port 5000")
);