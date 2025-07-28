// server/data/shared.js
// Fichier de données partagé entre client et serveur
// Contient les données directement pour éviter les problèmes d'import

// European countries data
const EUROPEAN_COUNTRIES = [
  { name: "Allemagne", isoCode: "DEU", altNames: [] },
  { name: "France", isoCode: "FRA", altNames: [] },
  { name: "Royaume-Uni", isoCode: "GBR", altNames: ["angleterre", "grande-bretagne"] },
  { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
  { name: "Belgique", isoCode: "BEL", altNames: [] },
  { name: "Irlande", isoCode: "IRL", altNames: [] },
  { name: "Luxembourg", isoCode: "LUX", altNames: [] },
  { name: "Monaco", isoCode: "MCO", altNames: [] },
  { name: "Andorre", isoCode: "AND", altNames: [] },
  { name: "Liechtenstein", isoCode: "LIE", altNames: [] },
  { name: "Suède", isoCode: "SWE", altNames: [] },
  { name: "Norvège", isoCode: "NOR", altNames: [] },
  { name: "Finlande", isoCode: "FIN", altNames: [] },
  { name: "Danemark", isoCode: "DNK", altNames: [] },
  { name: "Islande", isoCode: "ISL", altNames: [] },
  { name: "Lituanie", isoCode: "LTU", altNames: [] },
  { name: "Lettonie", isoCode: "LVA", altNames: [] },
  { name: "Estonie", isoCode: "EST", altNames: [] },
  { name: "Pologne", isoCode: "POL", altNames: [] },
  { name: "Ukraine", isoCode: "UKR", altNames: [] },
  { name: "Biélorussie", isoCode: "BLR", altNames: [] },
  { name: "Tchéquie", isoCode: "CZE", altNames: ["république tchèque"] },
  { name: "Slovaquie", isoCode: "SVK", altNames: [] },
  { name: "Hongrie", isoCode: "HUN", altNames: [] },
  { name: "Roumanie", isoCode: "ROU", altNames: [] },
  { name: "Bulgarie", isoCode: "BGR", altNames: [] },
  { name: "Moldavie", isoCode: "MDA", altNames: [] },
  { name: "Italie", isoCode: "ITA", altNames: [] },
  { name: "Espagne", isoCode: "ESP", altNames: [] },
  { name: "Portugal", isoCode: "PRT", altNames: [] },
  { name: "Grèce", isoCode: "GRC", altNames: [] },
  { name: "Croatie", isoCode: "HRV", altNames: [] },
  { name: "Slovénie", isoCode: "SVN", altNames: [] },
  { name: "Bosnie-Herzégovine", isoCode: "BIH", altNames: ["bosnie"] },
  { name: "Serbie", isoCode: "SRB", altNames: [] },
  { name: "Albanie", isoCode: "ALB", altNames: [] },
  { name: "Kosovo", isoCode: "XKX", altNames: [] },
  { name: "Monténégro", isoCode: "MNE", altNames: [] },
  { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macédoine"] },
  { name: "Chypre", isoCode: "CYP", altNames: [] },
  { name: "Malte", isoCode: "MLT", altNames: [] },
  { name: "Saint-Marin", isoCode: "SMR", altNames: [] },
  { name: "Vatican", isoCode: "VAT", altNames: [] },
  { name: "Suisse", isoCode: "CHE", altNames: [] },
  { name: "Autriche", isoCode: "AUT", altNames: [] }
];

// French regions data
const FRENCH_REGIONS = [
  { name: "Auvergne-Rhône-Alpes", code: "84", altNames: ["auvergne", "rhône-alpes"] },
  { name: "Bourgogne-Franche-Comté", code: "27", altNames: ["bourgogne", "franche-comté"] },
  { name: "Bretagne", code: "53", altNames: [] },
  { name: "Centre-Val de Loire", code: "24", altNames: ["centre", "val de loire"] },
  { name: "Corse", code: "94", altNames: [] },
  { name: "Grand Est", code: "44", altNames: ["alsace", "lorraine", "champagne-ardenne"] },
  { name: "Hauts-de-France", code: "32", altNames: ["nord-pas-de-calais", "picardie"] },
  { name: "Île-de-France", code: "11", altNames: ["paris"] },
  { name: "Normandie", code: "28", altNames: [] },
  { name: "Nouvelle-Aquitaine", code: "75", altNames: ["aquitaine", "limousin", "poitou-charentes"] },
  { name: "Occitanie", code: "76", altNames: ["languedoc-roussillon", "midi-pyrénées"] },
  { name: "Pays de la Loire", code: "52", altNames: [] },
  { name: "Provence-Alpes-Côte d'Azur", code: "93", altNames: ["paca", "provence"] },
  { name: "Guadeloupe", code: "01", altNames: [] },
  { name: "Martinique", code: "02", altNames: [] },
  { name: "Guyane", code: "03", altNames: [] },
  { name: "La Réunion", code: "04", altNames: [] },
  { name: "Mayotte", code: "06", altNames: [] }
];

// French regions with names (for complete mode)
const FRENCH_REGIONS_WITH_NAMES = [
  { name: 'Auvergne-Rhône-Alpes', code: 'AUVERGNE-RHÔNE-ALPES' },
  { name: 'Bourgogne-Franche-Comté', code: 'BOURGOGNE-FRANCHE-COMTÉ' },
  { name: 'Bretagne', code: 'BRETAGNE' },
  { name: 'Centre-Val de Loire', code: 'CENTRE-VAL DE LOIRE' },
  { name: 'Corse', code: 'CORSE' },
  { name: 'Grand Est', code: 'GRAND EST' },
  { name: 'Hauts-de-France', code: 'HAUTS-DE-FRANCE DOM' },
  { name: 'Île-de-France', code: 'ÎLE-DE-FRANCE DOM' },
  { name: 'Normandie', code: 'NORMANDIE' },
  { name: 'Nouvelle-Aquitaine', code: 'NOUVELLE-AQUITAINE' },
  { name: 'Occitanie', code: 'OCCITANIE' },
  { name: 'Pays de la Loire', code: 'PAYS DE LA LOIRE' },
  { name: "Provence-Alpes-Côte d'Azur", code: "PROVENCE-ALPES-CÔTE D'AZUR" },
  { name: 'Guadeloupe', code: 'GUADELOUPE' },
  { name: 'Martinique', code: 'MARTINIQUE' },
  { name: 'Guyane', code: 'GUYANE' },
  { name: 'La Réunion', code: 'LA RÉUNION' }
];

// Export des données pour le serveur
export const SERVER_DATA = {
  europe: {
    entities: EUROPEAN_COUNTRIES,
    name: 'europe'
  },
  franceComplete: {
    entities: FRENCH_REGIONS,
    name: 'franceComplete'
  }
};

// Fonction utilitaire pour normaliser les chaînes
export function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Fonction pour valider une réponse
export function validateAnswer(guess, correctAnswer, entities) {
  const normalizedGuess = normalizeString(guess);
  
  // Trouver l'entité
  const entity = entities.find(e => e.name === correctAnswer);
  if (!entity) return false;
  
  // Vérifier le nom principal
  if (normalizeString(entity.name) === normalizedGuess) {
    return true;
  }
  
  // Vérifier les noms alternatifs
  return entity.altNames?.some(altName => 
    normalizeString(altName) === normalizedGuess
  ) || false;
}
