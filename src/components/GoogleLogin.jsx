// src/components/GoogleLogin.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

export function GoogleLogin() {
  const handleLogin = () => {
    // Redirect to backend OAuth route
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: 16 }}>
      Login with Google
    </button>
  );
}

export function OAuthCallback() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  if (token) {
    localStorage.setItem('jwt', token);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>OAuth Callback</h2>
      {token ? (
        <>
          <p>JWT received:</p>
          <pre>{token}</pre>
          <p>Saved in localStorage.</p>
        </>
      ) : (
        <p>No token received. OAuth may have failed.</p>
      )}
    </div>
  );
}
