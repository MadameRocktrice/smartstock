import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

// Backend-URL aus Env-Variable (ohne /api, weil Socket.io seinen eigenen Pfad hat)
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api')
  .replace('/api', '');

export function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // Nur verbinden, wenn eingeloggt
    if (!isAuthenticated || !token) return;

    // Verbindung aufbauen
    const socket = io(SOCKET_URL, {
      auth: { token },  // Token mitschicken (brauchen wir später)
    });

    socketRef.current = socket;

    // Debug-Logs im Browser
    socket.on('connect', () => {
      console.log('Socket verbunden:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket getrennt');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket-Verbindungsfehler:', err.message);
    });

    // Cleanup: beim Unmount oder wenn Token/Auth sich ändert
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isAuthenticated]);

  return socketRef.current;
}