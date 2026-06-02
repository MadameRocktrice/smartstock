const API_URL = 'http://localhost:5001/api';

// Hilfsfunktion fuer Requests mit Token
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Ein Fehler ist aufgetreten');
  }
  
  return data;
}

// Konkrete Funktionen
export const api = {
  getProducts: () => apiRequest('/products'),
  getShoppingList: () => apiRequest('/shoppinglist'),
  getHouseholds: () => apiRequest('/households'),
  getCategories: () => apiRequest('/categories'),
  getLocations: () => apiRequest('/locations'),
};