// src/data/countries.js

// Fonction utilitaire pour normaliser les chaînes de caractères (minuscules, sans accents, trim)
export const normalizeString = (str) => {
    // Convertit les caractères accentués en leur équivalent non accentué, puis supprime les marques diacritiques
    // Met tout en minuscules et supprime les espaces inutiles.
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// Définition des pays européens avec noms alternatifs en français optimisés
export const EUROPEAN_COUNTRIES = [
    { name: "Allemagne", isoCode: "DEU", altNames: [] },
    { name: "France", isoCode: "FRA", altNames: [] },
    { name: "Italie", isoCode: "ITA", altNames: [] },
    { name: "Espagne", isoCode: "ESP", altNames: [] },
    { name: "Pologne", isoCode: "POL", altNames: [] },
    { name: "Royaume-Uni", isoCode: "GBR", altNames: ["royaume uni"] }, 
    { name: "Suède", isoCode: "SWE", altNames: [] }, 
    { name: "Norvège", isoCode: "NOR", altNames: [] }, 
    { name: "Finlande", isoCode: "FIN", altNames: [] },
    { name: "Autriche", isoCode: "AUT", altNames: [] },
    { name: "Belgique", isoCode: "BEL", altNames: [] },
    { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
    { name: "Suisse", isoCode: "CHE", altNames: [] },
    { name: "Irlande", isoCode: "IRL", altNames: [] },
    { name: "Portugal", isoCode: "PRT", altNames: [] },
    { name: "Grèce", isoCode: "GRC", altNames: [] }, 
    { name: "Danemark", isoCode: "DNK", altNames: [] },
    { name: "Tchéquie", isoCode: "CZE", altNames: ["republique tcheque"] }, 
    { name: "Hongrie", isoCode: "HUN", altNames: [] },
    { name: "Croatie", isoCode: "HRV", altNames: [] },
    { name: "Slovaquie", isoCode: "SVK", altNames: [] },
    { name: "Slovénie", isoCode: "SVN", altNames: [] },
    { name: "Bosnie-Herzégovine", isoCode: "BIH", altNames: ["bosnie herzegovine"] },
    { name: "Serbie", isoCode: "SRB", altNames: [] },
    { name: "Albanie", isoCode: "ALB", altNames: [] },
    { name: "Bulgarie", isoCode: "BGR", altNames: [] },
    { name: "Roumanie", isoCode: "ROU", altNames: [] },
    { name: "Ukraine", isoCode: "UKR", altNames: [] },
    { name: "Biélorussie", isoCode: "BLR", altNames: [] }, 
    { name: "Lituanie", isoCode: "LTU", altNames: [] },
    { name: "Lettonie", isoCode: "LVA", altNames: [] },
    { name: "Estonie", isoCode: "EST", altNames: [] },
    { name: "Islande", isoCode: "ISL", altNames: [] },
    { name: "Luxembourg", isoCode: "LUX", altNames: [] },
    { name: "Chypre", isoCode: "CYP", altNames: [] },
    { name: "Malte", isoCode: "MLT", altNames: [] },
    { name: "Kosovo", isoCode: "XKX", altNames: [] }, 
    { name: "Monténégro", isoCode: "MNE", altNames: [] }, 
    { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macedoine"] }, 
    { name: "Moldavie", isoCode: "MDA", altNames: [] }
];
