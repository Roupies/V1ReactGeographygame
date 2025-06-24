// src/components/game/MapChart/MapChart.jsx
import React from "react";
// Importez uniquement ComposableMap, Geographies, Geography
import { ComposableMap, Geographies, Geography } from "react-simple-maps"; 

const EUROPEAN_SUBREGIONS = [
    "Western Europe",
    "Eastern Europe",
    "Southern Europe",
    "Northern Europe",
    "Central Europe" 
];

// Couleurs utilisées précédemment
const NON_EUROPEAN_COUNTRY_FILL = "#282828"; 
const EUROPEAN_DEFAULT_FILL = "#505050"; 

// Le composant MapChart reçoit uniquement currentCountry et guessedCountries
const MapChart = ({ currentCountry, guessedCountries }) => { 

    // Configuration de la projection cartographique (conservée)
    const projectionConfig = {
        rotate: [-5.0, -35.0, 0], 
        scale: 350 
    };

    // Fonction qui détermine le style (couleur, bordure) de chaque entité géographique.
    // La logique des micro-états n'est plus présente ici.
    const getCountryStyle = (geo) => {
        const isGuessed = guessedCountries.some(c => c.isoCode === geo.properties.ISO_A3);
        const isCurrent = currentCountry && currentCountry.isoCode === geo.properties.ISO_A3;

        const isEuropeanCountry = geo.properties.SUBREGION && EUROPEAN_SUBREGIONS.includes(geo.properties.SUBREGION);
        
        if (isCurrent) {
            const currentCountryFillColor = "#FF4D4D"; 
            const currentCountryStrokeColor = "#CC0000"; 
            const currentCountryStrokeWidth = 0.5; 

            return {
                default: { 
                    fill: currentCountryFillColor, 
                    stroke: currentCountryStrokeColor, 
                    strokeWidth: currentCountryStrokeWidth, 
                    outline: "none",
                    filter: "url(#redBorderGlow)" 
                },
                hover: { 
                    fill: currentCountryFillColor, 
                    stroke: currentCountryStrokeColor, 
                    strokeWidth: currentCountryStrokeWidth, 
                    outline: "none",
                    filter: "url(#redBorderGlow)" 
                },
                pressed: { 
                    fill: "#E42", 
                    stroke: currentCountryStrokeColor, 
                    strokeWidth: currentCountryStrokeWidth, 
                    outline: "none",
                    filter: "url(#redBorderGlow)" 
                }
            };
        } 
        else if (isGuessed) {
            return {
                default: { fill: "#A8D9A7", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" },
                hover: { fill: "#A8D9A7", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" },
                pressed: { fill: "#A8D9A7", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" }
            };
        }

        if (isEuropeanCountry) {
            return {
                default: { fill: EUROPEAN_DEFAULT_FILL, stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" }, 
                hover: { fill: "#F53", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" }, 
                pressed: { fill: "#E42", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" }
            };
        } else {
            return {
                default: { fill: NON_EUROPEAN_COUNTRY_FILL, stroke: "none", outline: "none" }, 
                hover: { fill: NON_EUROPEAN_COUNTRY_FILL, stroke: "none", outline: "none" }, 
                pressed: { fill: NON_EUROPEAN_COUNTRY_FILL, stroke: "none", outline: "none" } 
            };
        }
    };

    // --- GESTION DE L'ÉTAT DE CHARGEMENT ---
    // Les logs de débogage et la logique de chargement ont été retirés,
    // car useGeographies et projection ne sont plus utilisés directement ici.
    // Geographies gère son propre état de chargement.

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={projectionConfig}>
                <defs>
                    <filter id="redBorderGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow 
                            dx="0" 
                            dy="0" 
                            stdDeviation="2.5" 
                            floodColor="#CC0000" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                {/* Retour à une seule instance de Geographies, sans logique de Circle */}
                <Geographies geography="/geojson/europe.json">
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
