// src/components/game/MapChart/MapChart.jsx
import React, { useState, useEffect } from "react";
// Importez uniquement ComposableMap, Geographies, Geography, Marker
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"; 
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

// Coordonnées standards des micro-états (longitude, latitude)
const MARKER_COORDINATES = {
    "AND": [1.5218, 42.5063], // Andorre
    "MCO": [7.4167, 43.7333], // Monaco  
    "MLT": [14.5146, 35.8989], // Malte
    "SMR": [12.4578, 43.9424], // Saint-Marin
    "LIE": [9.5215, 47.1410], // Liechtenstein
    "VAT": [12.4534, 41.9033], // Vatican
};

// Configurations de projection par défaut
const DEFAULT_PROJECTION = { rotate: [-5.0, -35.0, 0], scale: 350 };
const TABLET_PROJECTION = { 
    rotate: [-8.0, -50.0, 0],
    scale: 650, // Dézoom un peu par rapport à 800
    center: [0, 0]
};
const MOBILE_PROJECTION = { 
    rotate: [-8.0, -50.0, 0], // Même rotation que tablette pour centrer l'Europe
    scale: 1000,
    center: [0, 0] // Centré au lieu de décalé vers la droite
};

// Le composant MapChart reçoit uniquement currentCountry et guessedCountries
const MapChart = ({ currentCountry, guessedCountries, geoJsonPath, geoIdProperty = 'ISO_A3', projectionConfig }) => { 
    const [currentProjection, setCurrentProjection] = useState(DEFAULT_PROJECTION);

    // Gestion du responsive
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) { // Mobile phones
                setCurrentProjection(MOBILE_PROJECTION);
            } else if (window.innerWidth <= 768) { // Tablets
                setCurrentProjection(TABLET_PROJECTION);
            } else {
                setCurrentProjection(projectionConfig || DEFAULT_PROJECTION);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [projectionConfig]);

    // Liste des codes des pays d'Europe (pour le mode Europe)
    const europeanCountryCodes = EUROPEAN_COUNTRIES.map(c => String(c.isoCode));
    
    // Déterminer si on est en mode Europe (pour afficher les marqueurs)
    const isEuropeMode = geoIdProperty === 'ISO_A3';

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

    // Fonction pour obtenir le style des marqueurs
    const getMarkerStyle = (entityId) => {
        const isGuessed = guessedCountries.some(c => String(c.code || c.isoCode) === entityId);
        const isCurrent = currentCountry && String(currentCountry.code || currentCountry.isoCode) === entityId;

        if (isCurrent) {
            return {
                fill: "#FF4D4D", // Rouge pour le pays actuel
                stroke: "none",
                strokeWidth: 0,
                radius: 5
            };
        } else if (isGuessed) {
            return {
                fill: "#A8D9A7", // Vert pour les pays devinés
                stroke: "none", 
                strokeWidth: 0,
                radius: 4
            };
        } else {
            return {
                fill: "#FFFFFF", // Blanc comme les frontières
                stroke: "none",
                strokeWidth: 0,
                radius: 3
            };
        }
    };

    return (
        <div className="map-container" style={{ width: "100%", height: "100%" }}>
            <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={currentProjection}>
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

                {/* Sphères pour les micro-états et petits pays */}
                {isEuropeMode && Object.entries(MARKER_COORDINATES).map(([entityId, coordinates]) => {
                    // N'afficher la sphère que si c'est le pays courant
                    const isCurrent = currentCountry && String(currentCountry.code || currentCountry.isoCode) === entityId;
                    const isGuessed = guessedCountries.some(c => String(c.code || c.isoCode) === entityId);
                    
                    // Afficher seulement si c'est le pays courant ou s'il a déjà été deviné
                    if (!isCurrent && !isGuessed) {
                        return null;
                    }
                    
                    const markerStyle = getMarkerStyle(entityId);
                    return (
                        <Marker key={entityId} coordinates={coordinates}>
                            {/* Sphère simple */}
                            <circle 
                                cx="0"
                                cy="0"
                                r={markerStyle.radius}
                                fill={markerStyle.fill}
                                stroke={markerStyle.stroke}
                                strokeWidth={markerStyle.strokeWidth}
                                style={{
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                                }}
                            />
                        </Marker>
                    );
                })}
            </ComposableMap>
        </div>
    );
};

export default MapChart;
