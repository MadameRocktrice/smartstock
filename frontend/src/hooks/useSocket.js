import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';


const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api')
  .replace('/api', '');

export function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Nur verbinden, wenn eingeloggt
    if (!isAuthenticated || !token) {
      setSocket(null);
      return;
    }

    // Verbindung aufbauen
    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket verbunden:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket getrennt');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket-Verbindungsfehler:', err.message);
    });

    setSocket(newSocket);

    // Cleanup: beim Unmount oder wenn Token/Auth sich ändert
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token, isAuthenticated]);

  return socket;
}