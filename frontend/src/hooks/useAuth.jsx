import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

// Der Context
const AuthContext = createContext(null);

// Der Provider – stellt den Context zur Verfügung
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Beim Start: localStorage auslesen, falls schon eingeloggt
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login-Funktion
  async function login(email, password) {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login fehlgeschlagen');
    }
    // Erfolgreich: Daten speichern
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  // Register-Funktion
  async function register(username, email, password) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registrierung fehlgeschlagen');
    }
    // Erfolgreich: Daten speichern (direkt eingeloggt)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  // Logout-Funktion
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Der Hook – damit greifen andere Komponenten auf den Context zu
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider benutzt werden');
  }
  return context;
}