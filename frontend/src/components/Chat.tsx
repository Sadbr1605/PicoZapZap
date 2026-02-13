
import React, { useState, useEffect, useRef } from 'react';
import { Credentials, Message, Status } from '../types';
import { api } from '../services/api';

interface ChatProps {
  creds: Credentials;
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ creds, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastId, setLastId] = useState(0);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<Status>('connecting');
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    
    const doPoll = async () => {
      try {
        const data = await api.poll(creds, lastId);
        if (!isMounted) return;
        
        if (data.msgs.length > 0) {
          setMessages(prev => [...prev, ...data.msgs]);
          setLastId(data.latest);
        }
        setStatus('online');
        setErrorMsg('');
      } catch (err: any) {
        if (!isMounted) return;
        if (err.message === 'AUTH_ERROR') {
          onLogout();
        } else {
          setStatus('offline');
        }
      }
    };

    doPoll(); // Initial poll
    const interval = setInterval(doPoll, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [creds, lastId, onLogout]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || text.length > 280) return;

    try {
      setInputText('');
      await api.send(creds, text);
      // We don't append locally to ensure sync with server sequence
    } catch (err: any) {
      if (err.message === 'AUTH_ERROR') {
        onLogout();
      } else {
        setErrorMsg('Falha ao enviar mensagem');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <div>
          <div style={{ fontWeight: 'bold' }}>Dispositivo: {creds.thread_id}</div>
          <div className="status-indicator">
            <span className={`dot ${status}`}></span>
            {status === 'online' ? 'Online' : status === 'offline' ? 'Reconectando...' : 'Conectando...'}
          </div>
        </div>
        <button 
          onClick={onLogout}
          style={{ padding: '0.4rem 0.8rem', background: '#eee', color: '#333', fontSize: '0.8rem' }}
        >
          Sair
        </button>
      </header>

      <main className="messages-list">
        {messages.map((m) => (
          <div key={m.msg_id} className={`message-bubble ${m.from}`}>
            {m.text}
            <div className="message-time">
              {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-footer">
        {errorMsg && <div className="error-toast">{errorMsg}</div>}
        <form onSubmit={handleSend} className="input-row">
          <input 
            type="text"
            placeholder="Mensagem"
            value={inputText}
            maxLength={280}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" disabled={!inputText.trim()}>
            Enviar
          </button>
        </form>
        <div className="char-counter">
          {inputText.length}/280
        </div>
      </footer>
    </div>
  );
};
