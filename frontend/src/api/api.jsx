const API_URL = 'http://localhost:5001/api';

// Hilfsfunktion für Requests mit Token
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
  getProduct: (id) => apiRequest(`/products/${id}`),
  getShoppingList: () => apiRequest('/shoppinglist'),
  getHouseholds: () => apiRequest('/households'),
  getCategories: () => apiRequest('/categories'),
  getLocations: () => apiRequest('/locations'),

  // Produkt erstellen
  createProduct: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

    // Produkt updaten
  updateProduct: (id, data) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Produkt löschen
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Produkt auf Einkaufsliste setzen
  createShoppingItem: (data) => apiRequest('/shoppinglist', {
  method: 'POST',
  body: JSON.stringify(data),
  }),

  // Produkt auf Einkaufsliste aktualisieren
  updateShoppingItem: (id, data) => apiRequest(`/shoppinglist/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
  }),

  // Produkt auf Einkaufsliste lösche
  deleteShoppingItem: (id) => apiRequest(`/shoppinglist/${id}`, {
    method: 'DELETE',
  }),
};