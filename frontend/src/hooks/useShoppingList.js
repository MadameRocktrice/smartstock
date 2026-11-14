import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useSocket } from './useSocket';

export function useShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.getShoppingList();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Einkaufsliste:', err);
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Lokales Update eines einzelnen Items (fuer Optimistic Updates)
  const updateLocal = useCallback((itemId, changes) => {
    setItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, ...changes } : item))
    );
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Live-Updates via Socket.io - silent, damit kein Loading-Flicker
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadItems({ silent: true });
    };

    socket.on('shoppingItem:created', handleUpdate);
    socket.on('shoppingItem:updated', handleUpdate);
    socket.on('shoppingItem:deleted', handleUpdate);

    return () => {
      socket.off('shoppingItem:created', handleUpdate);
      socket.off('shoppingItem:updated', handleUpdate);
      socket.off('shoppingItem:deleted', handleUpdate);
    };
  }, [socket, loadItems]);

  return {
    items,
    loading,
    error,
    reload: loadItems,
    updateLocal,
  };
}
