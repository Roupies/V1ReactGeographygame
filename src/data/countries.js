// src/data/countries.js

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
