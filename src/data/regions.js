// Original regions with numeric codes
export const FRENCH_REGIONS = [
  { name: 'Auvergne-Rhône-Alpes', code: '84' },
  { name: 'Bourgogne-Franche-Comté', code: '27' },
  { name: 'Bretagne', code: '53' },
  { name: 'Centre-Val de Loire', code: '24' },
  { name: 'Corse', code: '94' },
  { name: 'Grand Est', code: '44' },
  { name: 'Hauts-de-France', code: '32' },
  { name: 'Île-de-France', code: '11' },
  { name: 'Normandie', code: '28' },
  { name: 'Nouvelle-Aquitaine', code: '75' },
  { name: 'Occitanie', code: '76' },
  { name: 'Pays de la Loire', code: '52' },
  { name: "Provence-Alpes-Côte d'Azur", code: '93' },
  { name: 'Guadeloupe', code: '01' },
  { name: 'Martinique', code: '02' },
  { name: 'Guyane', code: '03' },
  { name: 'La Réunion', code: '04' },
  { name: 'Mayotte', code: '06' }
];

// Regions adapted for France et Outre-mers.json (using region names as codes)
export const FRENCH_REGIONS_WITH_NAMES = [
  { name: 'Auvergne-Rhône-Alpes', code: 'AUVERGNE-RHÔNE-ALPES' },
  { name: 'Bourgogne-Franche-Comté', code: 'BOURGOGNE-FRANCHE-COMTÉ' },
  { name: 'Bretagne', code: 'BRETAGNE' },
  { name: 'Centre-Val de Loire', code: 'CENTRE-VAL DE LOIRE' },
  { name: 'Corse', code: 'CORSE' },
  { name: 'Grand Est', code: 'GRAND EST' },
  { name: 'Hauts-de-France', code: 'HAUTS-DE-FRANCE DOM' }, // Note: a "DOM" dans le fichier JSON
  { name: 'Île-de-France', code: 'ÎLE-DE-FRANCE DOM' },     // Note: a "DOM" dans le fichier JSON
  { name: 'Normandie', code: 'NORMANDIE' },
  { name: 'Nouvelle-Aquitaine', code: 'NOUVELLE-AQUITAINE' },
  { name: 'Occitanie', code: 'OCCITANIE' },
  { name: 'Pays de la Loire', code: 'PAYS DE LA LOIRE' },
  { name: "Provence-Alpes-Côte d'Azur", code: "PROVENCE-ALPES-CÔTE D'AZUR" }, // Corrigé: apostrophe droite pour correspondre au JSON
  { name: 'Guadeloupe', code: 'GUADELOUPE' },
  { name: 'Martinique', code: 'MARTINIQUE' },
  { name: 'Guyane', code: 'GUYANE' },
  { name: 'La Réunion', code: 'LA RÉUNION' }
]; 