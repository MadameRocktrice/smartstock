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
};

export function shortUnit(unit) {
  return UNIT_SHORT[unit] || unit;
}

// Komplette Einheiten-Liste für Datalist (Autocomplete)
export const ALL_UNITS = [
  'Stück',
  'Packung',
  'Flasche',
  'Dose',
  'Glas',
  'Tube',
  'Beutel',
];
