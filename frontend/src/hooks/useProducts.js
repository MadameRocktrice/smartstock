import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useSocket } from './useSocket';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // loadProducts mit "silent" Option (setLoading wird dann uebersprungen)
  const loadProducts = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Lokales Update eines einzelnen Produkts (fuer Optimistic Updates)
  const updateLocal = useCallback((productId, changes) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, ...changes } : p))
    );
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Live-Updates via Socket.io - silent, damit kein Loading-Flicker
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadProducts({ silent: true });
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
    updateLocal,
  };
}
