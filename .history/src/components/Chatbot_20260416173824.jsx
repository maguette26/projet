import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Mic, Plus, Trash2 } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const userId = localStorage.getItem("userId");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // ================= LOAD =================
  useEffect(() => {
    const saved = localStorage.getItem(`psybot_${userId || "guest"}`);

    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      setActiveId(parsed[0]?.id);
   