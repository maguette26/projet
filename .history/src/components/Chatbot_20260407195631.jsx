import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Lecture sécurisée du user connecté
  const [userEmail, setUserEmail] = useState(null);

  // Header-style : détecter si utilisateur est connecté
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentRole(localStorage.getItem('role'));
      setUserEmail(localStorage.getItem('email') || null);
    };
    window.addEventListener('storage', handleStorageChange);

    const email = localStorage.getItem('email');
    setUserEmail(email || null);

    // Charger messages uniquement si connecté
    if (email) {
      const saved = JSON.parse(localStorage.getItem('psybot_history_' + email)) || [];
      setMessages(saved.length ? saved : [
        {
          sender: "bot",
          text: "Bonjour 😊 Je suis PsyBot, ton assistant bien-être. Comment te sens-tu aujourd’hui ?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } else {
      setMessages([
        {
          sender: "bot",
          text: "Bonjour 😊 Je suis PsyBot, ton assistant bien-être. Connecte-toi pour garder l'historique.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Scroll automatique
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sauvegarde uniquement si utilisateur connecté
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('psybot_history_' + userEmail, JSON.stringify(messages));
    }
  }, [messages, userEmail]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, email: userEmail || null }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Je suis là… mais j’ai un petit souci 😢",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
        {messages.map((msg, i) => (
          <div key={i} className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
            <div className="p-3 rounded-4 shadow-sm" style={{
              maxWidth: "70%",
              backgroundColor: msg.sender === "user" ? "#0d6efd" : "#e9f5f9",
              color: msg.sender === "user" ? "#fff" : "#1f3d4d",
            }}>
              {msg.text}
              <small className="d-block text-end mt-1" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{msg.time}</small>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 bg-white d-flex gap-2 shadow-sm" style={{ borderTop: '1px solid #ddd' }}>
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Exprime-toi librement..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!currentRole} // si non connecté, pas de saisie
        />
        <button className="btn btn-primary rounded-circle" onClick={sendMessage} disabled={!currentRole}>
          <Send size={20} className="text-white" />
        </button>
      </div>
      {!currentRole && (
        <div className="p-3 text-center text-red-600 bg-yellow-50">
          Veuillez vous connecter pour garder vos discussions en mémoire.
        </div>
      )}
    </div>
  );
};

export default Chatbot;