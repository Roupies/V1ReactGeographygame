// src/components/game/MapChart/MapChart.jsx
import React from "react";
// Importez uniquement ComposableMap, Geographies, Geography
import { ComposableMap, Geographies, Geography } from "react-simple-maps"; 
import { EUROPEAN_COUNTRIES } from '../../../data/countries';

const EUROPEAN_SUBREGIONS = [
    "Western Europe",
    "Eastern Europe",
    "Southern Europe",
    "Northern Europe",
    "Central Europe" 
];

// Couleurs utilisées précédemment
const NON_EUROPEAN_COUNTRY_FILL = "#232323"; // Gris très sombre, proche du screenshot
const EUROPEAN_DEFAULT_FILL = "#505050"; 

// Le composant MapChart reçoit uniquement currentCountry et guessedCountries
const MapChart = ({ currentCountry, guessedCountries, geoJsonPath, geoIdProperty = 'ISO_A3', projectionConfig }) => { 

    // Utilise la projection passée en prop, sinon une valeur par défaut (Europe)
    const defaultProjection = { rotate: [-5.0, -35.0, 0], scale: 350 };
    const projConfig = projectionConfig || defaultProjection;

    // Liste des codes des pays d'Europe (pour le mode Europe)
    const europeanCountryCodes = EUROPEAN_COUNTRIES.map(c => String(c.isoCode));

    // Fonction qui détermine le style (couleur, bordure) de chaque entité géographique.
    // La logique des micro-états n'est plus présente ici.
    const getCountryStyle = (geo) => {
        const geoId = String(geo.properties[geoIdProperty]);
        const isGuessed = guessedCountries.some(c => String(c.code) === geoId || String(c.isoCode) === geoId);
        const isCurrent = currentCountry && (String(currentCountry.code) === geoId || String(currentCountry.isoCode) === geoId);

        if (isCurrent) {
            const style = { 
                fill: "#FF4D4D",
                stroke: "transparent",
                strokeWidth: 0,
                outline: "none",
                strokeOpacity: 0
            };
            return {
                default: style,
                hover: style,
                pressed: style
            };
        } 
        else if (isGuessed) {
            const style = { fill: "#A8D9A7", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" };
            return {
                default: style,
                hover: style,
                pressed: style
            };
        }

        // --- LOGIQUE SPÉCIFIQUE AU MODE EUROPE ---
        // Si le geoId est dans la liste des pays d'Europe, couleur Europe, sinon couleur hors Europe
        if (geoIdProperty === 'ISO_A3') {
            const isEuropean = europeanCountryCodes.includes(geoId);
            if (isEuropean) {
                const style = {
                    fill: EUROPEAN_DEFAULT_FILL,
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none"
                };
                return {
                    default: style,
                    hover: style,
                    pressed: style
                };
            } else {
                const style = {
                    fill: NON_EUROPEAN_COUNTRY_FILL,
                    stroke: "none",
                    strokeWidth: 0,
                    outline: "none"
                };
                return {
                    default: style,
                    hover: style,
                    pressed: style
                };
            }
        }

        // --- LOGIQUE PAR DÉFAUT (régions, etc.) ---
        const style = { fill: '#505050', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none' };
        return {
            default: style,
            hover: style,
            pressed: style
        };
    };

    // --- GESTION DE L'ÉTAT DE CHARGEMENT ---
    // Les logs de débogage et la logique de chargement ont été retirés,
    // car useGeographies et projection ne sont plus utilisés directement ici.
    // Geographies gère son propre état de chargement.

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={projConfig}>
                <defs>
                    {/* Suppression du filtre redBorderGlow car il n'est plus utilisé */}
                </defs>

                {/* Retour à une seule instance de Geographies, sans logique de Circle */}
                <Geographies geography={geoJsonPath}>
                    {({ geographies }) =>
                        geographies.map(geo => (
                            <Geography
                                key={geo.rsmKey} 
                                geography={geo}
                                style={getCountryStyle(geo)}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default MapChart;
