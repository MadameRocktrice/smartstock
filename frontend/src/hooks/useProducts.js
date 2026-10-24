import { useState, useEffect } from 'react';
import { api } from '../api/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // reload-Funktion zurückgeben, damit die Komponente neu laden kann
  return {
    products,
    loading,
    error,
    reload: loadProducts,
  };
}