import { useState, useEffect } from 'react';
import { api } from '../api/api';

export function useShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadItems() {
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
  }

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    reload: loadItems,
  };
}