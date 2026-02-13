
import React, { useState } from 'react';
import { Credentials } from '../types';

interface LoginProps {
  onLogin: (creds: Credentials) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [threadId, setThreadId] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || !pairCode) {
      setError('Preencha todos os campos');
      return;
    }
    onLogin({ thread_id: threadId, pair_code: pairCode });
  };

  return (
    <div className="login-screen">
      <div>
        <h1>PicoZapZap</h1>
        <p style={{ color: '#667781', fontSize: '0.9rem' }}>Conecte sua BitDogLab v7</p>
      </div>

      <form onSubmit={handleSubmit} className="login-screen">
        <div className="input-group">
          <label>Thread ID</label>
          <input 
            type="text" 
            placeholder="Ex: 12345"
            value={threadId}
            onChange={(e) => setThreadId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Pair Code</label>
          <input 
            type="text" 
            placeholder="Ex: ABCD"
            value={pairCode}
            onChange={(e) => setPairCode(e.target.value)}
          />
        </div>

        {error && <div className="error-toast">{error}</div>}

        <button type="submit">Conectar</button>
      </form>
      
      <p style={{ fontSize: '0.8rem', color: '#999' }}>
        O ID e Código aparecem no display OLED da placa.
      </p>
    </div>
  );
};
