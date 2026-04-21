import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Sync avec le Header : role + email
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email'));

  // Écoute les changements dans localStorage pour suivre login/logout
  useEffect(() => {
    const handleStorageChange = () => {
      const role = localStorage.getItem('role');
      const email = localStorage.getItem('email');
      setCurrentRole(role);
      setUserEmail(email);

      // Recharge messages si user connecté
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
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // initial sync

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Scroll auto
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sauvegarde si connecté
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('psybot_history_' + userEmail, JSON.stringify(messages));
    }
  }, [messages, userEmail]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Si pas connecté, on affiche juste message local
    if (!currentRole) {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Veuillez vous connecter pour sauvegarder vos messages.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setInput('');
      return;
    }

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
        body: JSON.stringify({ message: userMsg.text, email: userEmail }),
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
          placeholder={currentRole ? "Exprime-toi librement..." : "Connecte-toi pour discuter"}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={!currentRole} // désactive si non connecté
        />
        <button className="btn btn-primary rounded-circle" onClick={sendMessage} disabled={!currentRole}>
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;