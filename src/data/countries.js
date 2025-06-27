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

// Définition des pays européens avec noms alternatifs en français optimisés
export const EUROPEAN_COUNTRIES = [
    { name: "Allemagne", isoCode: "DEU" },
    { name: "France", isoCode: "FRA" },
    { name: "Italie", isoCode: "ITA" },
    { name: "Espagne", isoCode: "ESP" },
    { name: "Pologne", isoCode: "POL" },
    { name: "Royaume-Uni", isoCode: "GBR" },
    { name: "Suède", isoCode: "SWE" },
    { name: "Norvège", isoCode: "NOR" },
    { name: "Finlande", isoCode: "FIN" },
    { name: "Autriche", isoCode: "AUT" },
    { name: "Belgique", isoCode: "BEL" },
    { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
    { name: "Suisse", isoCode: "CHE" },
    { name: "Irlande", isoCode: "IRL" },
    { name: "Portugal", isoCode: "PRT" },
    { name: "Grèce", isoCode: "GRC" },
    { name: "Danemark", isoCode: "DNK" },
    { name: "Tchéquie", isoCode: "CZE" },
    { name: "Hongrie", isoCode: "HUN" },
    { name: "Croatie", isoCode: "HRV" },
    { name: "Slovaquie", isoCode: "SVK" },
    { name: "Slovénie", isoCode: "SVN" },
    { name: "Bosnie-Herzégovine", isoCode: "BIH" },
    { name: "Serbie", isoCode: "SRB" },
    { name: "Albanie", isoCode: "ALB" },
    { name: "Bulgarie", isoCode: "BGR" },
    { name: "Roumanie", isoCode: "ROU" },
    { name: "Ukraine", isoCode: "UKR" },
    { name: "Biélorussie", isoCode: "BLR" },
    { name: "Lituanie", isoCode: "LTU" },
    { name: "Lettonie", isoCode: "LVA" },
    { name: "Estonie", isoCode: "EST" },
    { name: "Islande", isoCode: "ISL" },
    { name: "Luxembourg", isoCode: "LUX" },
    { name: "Chypre", isoCode: "CYP" },
    { name: "Malte", isoCode: "MLT" },
    { name: "Kosovo", isoCode: "XKX" },
    { name: "Monténégro", isoCode: "MNE" },
    { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macedoine"] },
    { name: "Moldavie", isoCode: "MDA" }
];
