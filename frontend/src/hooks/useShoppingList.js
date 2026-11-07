import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useSocket } from './useSocket';

export function useShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
  try {
    setLoading(true);
    const data = await api.getShoppingList();
    setItems(data);
    setError(null);
  } catch (err) {
    console.error('Fehler beim Laden der Einkaufsliste:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadItems();
  }, []);

  // Live-Updates via Socket.io
const socket = useSocket();

useEffect(() => {
  if (!socket) return;

  const handleUpdate = () => {
    console.log('📡 Einkaufsliste-Event empfangen → neu laden');
    loadItems();  // oder wie auch immer deine Load-Funktion heisst!
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
  };
}