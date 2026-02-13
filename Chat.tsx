
import React, { useState, useEffect, useRef } from 'react';
import { Credentials, Message, Status } from './types';
import { api } from './api';

interface ChatProps {
  creds: Credentials;
  onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ creds, onLogout }) => {
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
          setMessages(prev => {
             // Avoid duplicate IDs if poll returns overlap
             const existingIds = new Set(prev.map(m => m.msg_id));
             const newMsgs = data.msgs.filter(m => !existingIds.has(m.msg_id));
             return [...prev, ...newMsgs];
          });
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

    doPoll(); 
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
      const originalText = inputText;
      setInputText('');
      await api.send(creds, text);
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
          style={{ padding: '0.4rem 0.8rem', background: '#eee', color: '#333', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          Sair
        </button>
      </header>

      <main className="messages-list">
        {messages.length === 0 && status === 'online' && (
          <div style={{ textAlign: 'center', color: '#667781', marginTop: '2rem', fontSize: '0.9rem' }}>
            Nenhuma mensagem ainda.
          </div>
        )}
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

export default Chat;
