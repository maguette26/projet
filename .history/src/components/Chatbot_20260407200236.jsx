import React, { useState, useEffect, useRef, useContext } from 'react';
 
import { Bot, Send } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from '../AuthContext';

const Chatbot = () => {
  const { user } = useContext(AuthContext); // récupération de l'état global
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (user.email) {
      const saved = JSON.parse(localStorage.getItem('psybot_history_' + user.email)) || [];
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
          text: "Bonjour 😊 Connectez-vous pour garder votre historique.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [user.email]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user.email) {
      localStorage.setItem('psybot_history_' + user.email, JSON.stringify(messages));
    }
  }, [messages, user.email]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!user.role) {
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
        body: JSON.stringify({ message: userMsg.text, email: user.email }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Je suis là… mais j’ai un petit souci 😢", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ]);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
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
      <div className="p-3 bg-white d-flex gap-2 shadow-sm" style={{ borderTop: '1px solid #ddd' }}>
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder={user.role ? "Exprime-toi librement..." : "Connecte-toi pour discuter"}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={!user.role}
        />
        <button className="btn btn-primary rounded-circle" onClick={sendMessage} disabled={!user.role}>
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;