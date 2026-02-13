
import React, { useState, useEffect } from 'react';
import { Credentials } from './types';
import Login from './Login';
import Chat from './Chat';

const STORAGE_KEY = 'pico_zap_creds';

const App: React.FC = () => {
  const [creds, setCreds] = useState<Credentials | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCreds(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleLogin = (newCreds: Credentials) => {
    setCreds(newCreds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCreds));
  };

  const handleLogout = () => {
    setCreds(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="app-container">
      {creds ? (
        <Chat creds={creds} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
