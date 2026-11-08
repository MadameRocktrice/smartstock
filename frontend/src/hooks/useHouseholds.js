import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/api';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';

export function useHouseholds() {
  const { isAuthenticated } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Haushalte vom Backend holen
  const loadHouseholds = useCallback(async () => {
    if (!isAuthenticated) {
      setHouseholds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getHouseholds();
      setHouseholds(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Haushalte:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Beim Mount und bei Login-Änderung laden
  useEffect(() => {
    loadHouseholds();
  }, [loadHouseholds]);

  // Live-Update bei Notiz-Änderung
const socket = useSocket();

useEffect(() => {
  if (!socket) return;

  const handleNoteUpdate = () => {
    console.log('📡 Notiz-Event empfangen → neu laden');
    loadHouseholds();
  };

  socket.on('household:noteUpdated', handleNoteUpdate);

  return () => {
    socket.off('household:noteUpdated', handleNoteUpdate);
  };
}, [socket, loadHouseholds]);

  // Aktiver Haushalt = letzter in der Liste (chronologisch beigetreten)
  const activeHousehold = households.length > 0
    ? households[households.length - 1]
    : null;

  // Hat der User schon einen eigenen erstellt (als Owner)?
  const hasOwnHousehold = households.some(
    (h) => h.owner?._id === h.members?.find((m) => m._id === h.owner?._id)?._id
  );

  return {
    households,
    activeHousehold,
    hasOwnHousehold,
    loading,
    error,
    reload: loadHouseholds,
  };
}