import { useState, useEffect } from 'react';
import { api } from '../api/api';

export function useFormData() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [cats, locs, hhs] = await Promise.all([
          api.getCategories(),
          api.getLocations(),
          api.getHouseholds(),
        ]);
        setCategories(cats);
        setLocations(locs);
        setHouseholds(hhs);
      } catch (err) {
        console.error('Fehler beim Laden der Formulardaten:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFormData();
  }, []);

  return {
    categories,
    locations,
    households,
    loading,
    error,
  };
}