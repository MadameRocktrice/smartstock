// Mapping: Ausgeschrieben → Kürzel für die Anzeige
export const UNIT_SHORT = {
  'Stück': 'Stk',
  'Packung': 'Pck',
  'Flasche': 'Fl',
  'Flaschen': 'Fl',
  'Dose': 'Dose',
  'Glas': 'Glas',
  'Tube': 'Tube',
  'Beutel': 'Beutel',
  'Liter': 'L',
  'Milliliter': 'ml',
  'Kilogramm': 'kg',
  'Gramm': 'g',
};

export function shortUnit(unit) {
  return UNIT_SHORT[unit] || unit;
}

// Einheiten mit variablen Mengen (Zähler-Schritt frei wählbar)
export const VARIABLE_UNITS = ['Gramm', 'Milliliter', 'Liter', 'Kilogramm'];

// Mögliche Zähler-Schritte je Einheit
export const STEP_OPTIONS = {
  'Gramm': [1, 5, 10, 25, 50, 100, 250, 500],
  'Milliliter': [1, 10, 25, 50, 100, 250, 500],
  'Liter': [0.1, 0.25, 0.5, 1],
  'Kilogramm': [0.1, 0.25, 0.5, 1],
};

// Komplette Einheiten-Liste für Datalist
export const ALL_UNITS = [
  'Stück',
  'Packung',
  'Flasche',
  'Dose',
  'Glas',
  'Tube',
  'Beutel',
  'Liter',
  'Milliliter',
  'Kilogramm',
  'Gramm',
];

// Dezimalzahlen sauber formatieren (0.1 + 0.2 → 0.3 statt 0.30000...)
export function formatAmount(value) {
  if (value == null || value === '') return '0';
  // Auf 2 Dezimalstellen runden, dann trailing Nullen entfernen
  return parseFloat(Number(value).toFixed(2)).toString();
}