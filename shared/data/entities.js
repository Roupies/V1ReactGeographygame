// Shared data module for both client and server
// Contains all game entities and utility functions

// Fonction utilitaire pour normaliser les chaînes de caractères (minuscules, sans accents, trim)
export const normalizeString = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // accents
        .replace(/[-'`.]/g, " ")        // tirets, apostrophes, points → espace
        .replace(/\s+/g, " ")            // espaces multiples → un seul
        .toLowerCase()
        .trim();
};

// Classification des pays européens par sous-régions (comme sur l'image de référence)
export const EUROPEAN_SUBREGIONS = {
    "Western Europe": [
        { name: "France", isoCode: "FRA" },
        { name: "Allemagne", isoCode: "DEU" },
        { name: "Royaume-Uni", isoCode: "GBR" },
        { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
        { name: "Belgique", isoCode: "BEL" },
        { name: "Irlande", isoCode: "IRL" },
        { name: "Luxembourg", isoCode: "LUX", needsMarker: true },
        { name: "Monaco", isoCode: "MCO", needsMarker: true },
        { name: "Andorre", isoCode: "AND", needsMarker: true },
        { name: "Liechtenstein", isoCode: "LIE", needsMarker: true },
    ],
    "Northern Europe": [
        { name: "Suède", isoCode: "SWE" },
        { name: "Norvège", isoCode: "NOR" },
        { name: "Finlande", isoCode: "FIN" },
        { name: "Danemark", isoCode: "DNK" },
        { name: "Islande", isoCode: "ISL" },
        { name: "Lituanie", isoCode: "LTU" },
        { name: "Lettonie", isoCode: "LVA" },
        { name: "Estonie", isoCode: "EST" },
    ],
    "Eastern Europe": [
        { name: "Pologne", isoCode: "POL" },
        { name: "Ukraine", isoCode: "UKR" },
        { name: "Biélorussie", isoCode: "BLR" },
        { name: "Russie", isoCode: "RUS" },
        { name: "Tchéquie", isoCode: "CZE" },
        { name: "Slovaquie", isoCode: "SVK" },
        { name: "Hongrie", isoCode: "HUN" },
        { name: "Roumanie", isoCode: "ROU" },
        { name: "Bulgarie", isoCode: "BGR" },
        { name: "Moldavie", isoCode: "MDA" },
    ],
    "Southern Europe": [
        { name: "Italie", isoCode: "ITA" },
        { name: "Espagne", isoCode: "ESP" },
        { name: "Portugal", isoCode: "PRT" },
        { name: "Grèce", isoCode: "GRC" },
        { name: "Croatie", isoCode: "HRV" },
        { name: "Slovénie", isoCode: "SVN", needsMarker: true },
        { name: "Bosnie-Herzégovine", isoCode: "BIH" },
        { name: "Serbie", isoCode: "SRB" },
        { name: "Albanie", isoCode: "ALB" },
        { name: "Kosovo", isoCode: "XKX", needsMarker: true },
        { name: "Monténégro", isoCode: "MNE", needsMarker: true },
        { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macedoine"], needsMarker: true },
        { name: "Chypre", isoCode: "CYP", needsMarker: true },
        { name: "Malte", isoCode: "MLT", needsMarker: true },
        { name: "Saint-Marin", isoCode: "SMR", needsMarker: true },
        { name: "Vatican", isoCode: "VAT", needsMarker: true },
        { name: "Autriche", isoCode: "AUT" },
        { name: "Suisse", isoCode: "CHE" },
    ]
};

// Définition des pays européens avec noms alternatifs en français optimisés (liste plate pour compatibilité)
export const EUROPEAN_COUNTRIES = [
    // Western Europe
    { name: "Allemagne", isoCode: "DEU" },
    { name: "France", isoCode: "FRA" },
    { name: "Royaume-Uni", isoCode: "GBR" },
    { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
    { name: "Belgique", isoCode: "BEL" },
    { name: "Irlande", isoCode: "IRL" },
    { name: "Luxembourg", isoCode: "LUX", needsMarker: true },
    { name: "Monaco", isoCode: "MCO", needsMarker: true },
    { name: "Andorre", isoCode: "AND", needsMarker: true },
    { name: "Liechtenstein", isoCode: "LIE", needsMarker: true },
    
    // Northern Europe  
    { name: "Suède", isoCode: "SWE" },
    { name: "Norvège", isoCode: "NOR" },
    { name: "Finlande", isoCode: "FIN" },
    { name: "Danemark", isoCode: "DNK" },
    { name: "Islande", isoCode: "ISL" },
    { name: "Lituanie", isoCode: "LTU" },
    { name: "Lettonie", isoCode: "LVA" },
    { name: "Estonie", isoCode: "EST" },
    
    // Eastern Europe
    { name: "Pologne", isoCode: "POL" },
    { name: "Ukraine", isoCode: "UKR" },
    { name: "Biélorussie", isoCode: "BLR" },
    { name: "Russie", isoCode: "RUS" },
    { name: "Tchéquie", isoCode: "CZE" },
    { name: "Slovaquie", isoCode: "SVK" },
    { name: "Hongrie", isoCode: "HUN" },
    { name: "Roumanie", isoCode: "ROU" },
    { name: "Bulgarie", isoCode: "BGR" },
    { name: "Moldavie", isoCode: "MDA" },
    
    // Southern Europe
    { name: "Italie", isoCode: "ITA" },
    { name: "Espagne", isoCode: "ESP" },
    { name: "Portugal", isoCode: "PRT" },
    { name: "Grèce", isoCode: "GRC" },
    { name: "Croatie", isoCode: "HRV" },
    { name: "Slovénie", isoCode: "SVN", needsMarker: true },
    { name: "Bosnie-Herzégovine", isoCode: "BIH" },
    { name: "Serbie", isoCode: "SRB" },
    { name: "Albanie", isoCode: "ALB" },
    { name: "Kosovo", isoCode: "XKX" },
    { name: "Monténégro", isoCode: "MNE", needsMarker: true },
    { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macedoine"], needsMarker: true },
    { name: "Chypre", isoCode: "CYP", needsMarker: true },
    { name: "Malte", isoCode: "MLT", needsMarker: true },
    { name: "Saint-Marin", isoCode: "SMR", needsMarker: true },
    { name: "Vatican", isoCode: "VAT", needsMarker: true },
    { name: "Autriche", isoCode: "AUT" },
    { name: "Suisse", isoCode: "CHE" }
];

// French regions data
export const FRENCH_REGIONS = [
    { name: "Auvergne-Rhône-Alpes", code: "84", altNames: ["Auvergne Rhône Alpes", "Rhône-Alpes"] },
    { name: "Bourgogne-Franche-Comté", code: "27", altNames: ["Bourgogne Franche Comté"] },
    { name: "Bretagne", code: "53", altNames: [] },
    { name: "Centre-Val de Loire", code: "24", altNames: ["Centre", "Val de Loire"] },
    { name: "Corse", code: "94", altNames: ["Corsica"] },
    { name: "Grand Est", code: "44", altNames: ["Alsace-Champagne-Ardenne-Lorraine"] },
    { name: "Hauts-de-France", code: "32", altNames: ["Nord-Pas-de-Calais-Picardie"] },
    { name: "Île-de-France", code: "11", altNames: ["IDF", "Paris"] },
    { name: "Normandie", code: "28", altNames: ["Basse-Normandie", "Haute-Normandie"] },
    { name: "Nouvelle-Aquitaine", code: "75", altNames: ["Aquitaine-Limousin-Poitou-Charentes"] },
    { name: "Occitanie", code: "76", altNames: ["Languedoc-Roussillon-Midi-Pyrénées", "Midi-Pyrénées"] },
    { name: "Pays de la Loire", code: "52", altNames: [] },
    { name: "Provence-Alpes-Côte d'Azur", code: "93", altNames: ["PACA", "Provence"] },
    { name: "Guadeloupe", code: "01", altNames: [] },
    { name: "Martinique", code: "02", altNames: [] },
    { name: "Guyane", code: "03", altNames: ["Guyane française"] },
    { name: "La Réunion", code: "04", altNames: ["Réunion"] },
    { name: "Mayotte", code: "06", altNames: [] }
];

// Game mode configurations for server
export const GAME_MODE_CONFIGS = {
    europe: {
        entities: EUROPEAN_COUNTRIES,
        name: 'europe',
        idProperty: 'isoCode'
    },
    europeRace: {
        entities: EUROPEAN_COUNTRIES,
        name: 'europeRace',
        idProperty: 'isoCode',
        gameType: 'race',
        scoreThreshold: 100,
        pointsPerCorrect: 10,
        pointsPerWrong: -2
    },
    franceComplete: {
        entities: FRENCH_REGIONS,
        name: 'franceComplete',
        idProperty: 'code'
    },
    franceRegions: {
        entities: FRENCH_REGIONS,
        name: 'franceRegions',
        idProperty: 'code'
    }
};

// Fonction pour valider une réponse - logique unifiée client-serveur
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