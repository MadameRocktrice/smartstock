import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useSocket } from './useSocket';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      console.log('🔄 Produkte neu geladen:', data.length, 'Produkte', data);  // ← Debug
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Live-Updates via Socket.io
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      console.log('📡 Produkt-Event empfangen → neu laden');
      loadProducts();
    };

    socket.on('product:created', handleUpdate);
    socket.on('product:updated', handleUpdate);
    socket.on('product:deleted', handleUpdate);

    return () => {
      socket.off('product:created', handleUpdate);
      socket.off('product:updated', handleUpdate);
      socket.off('product:deleted', handleUpdate);
    };
  }, [socket, loadProducts]);

  return {
    products,
    loading,
    error,
    reload: loadProducts,
  };
}