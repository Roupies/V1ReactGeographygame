// src/components/game/MapChart/MapChart.jsx
// Interactive map component using react-simple-maps for geography visualization
// Handles country/region highlighting, micro-states markers, and responsive design
import React, { useState, useEffect, useMemo } from "react";
// Importez uniquement ComposableMap, Geographies, Geography, Marker
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"; 
import { EUROPEAN_COUNTRIES } from '../../../data/countries';

// European subregions for potential future filtering
const EUROPEAN_SUBREGIONS = [
    "Western Europe",
    "Eastern Europe",
    "Southern Europe",
    "Northern Europe",
    "Central Europe" 
];

// Color scheme for map visualization
const NON_EUROPEAN_COUNTRY_FILL = "#232323"; // Very dark gray for non-European countries
const EUROPEAN_DEFAULT_FILL = "#505050"; // Medium gray for European countries

// Coordinate definitions for micro-states that are too small to see on the map
// These coordinates are in [longitude, latitude] format for precise positioning
const MARKER_COORDINATES = {
    "AND": [1.5218, 42.5063],   // Andorra
    "MCO": [7.4167, 43.7333],   // Monaco  
    "MLT": [14.5146, 35.8989],  // Malta
    "SMR": [12.4578, 43.9424],  // San Marino
    "LIE": [9.5215, 47.1410],   // Liechtenstein
    "VAT": [12.4534, 41.9033],  // Vatican City
};

// Map projection configurations for different screen sizes
// These control zoom level, rotation, and centering of the map
const DEFAULT_PROJECTION = { rotate: [-5.0, -35.0, 0], scale: 350 };
const TABLET_PROJECTION = { 
    rotate: [-8.0, -50.0, 0],
    scale: 650, // Slightly zoomed out compared to mobile
    center: [0, 0]
};
const MOBILE_PROJECTION = { 
    rotate: [-8.0, -50.0, 0], // Same rotation as tablet to center Europe
    scale: 1000,              // More zoomed in for mobile screens
    center: [0, 0]            // Centered instead of offset
};

// Main MapChart component - receives game state and configuration as props
const MapChart = ({ 
    currentCountry,      // Entity currently being guessed (highlighted in red)
    guessedCountries,    // Array of successfully guessed entities (shown in green)
    geoJsonPath,         // Path to GeoJSON data file
    geoIdProperty = 'ISO_A3',  // Property name for matching entities (ISO_A3 for countries, code for regions)
    projectionConfig     // Map projection settings from game configuration
}) => { 
    // State for managing responsive map projection
    const [currentProjection, setCurrentProjection] = useState(projectionConfig || DEFAULT_PROJECTION);

    // Responsive design handler - only update when projectionConfig actually changes
    useEffect(() => {
        if (projectionConfig) {
            setCurrentProjection(projectionConfig);
            }
    }, [projectionConfig]);

    // Memoize European country codes to prevent recalculation
    const europeanCountryCodes = useMemo(() => 
        EUROPEAN_COUNTRIES.map(c => String(c.isoCode)), 
        []
    );
    
    // Determine if we're in Europe mode (for micro-states markers display)
    const isEuropeMode = geoIdProperty === 'ISO_A3';

    // Memoize style function to prevent recreation on every render
    const getCountryStyle = useMemo(() => (geo) => {
        const geoId = String(geo.properties[geoIdProperty]);
        
        // Check if this entity has been successfully guessed
        const isGuessed = guessedCountries.some(c => 
            String(c.code) === geoId || String(c.isoCode) === geoId
        );
        
        // Check if this is the current entity to guess
        const isCurrent = currentCountry && (
            String(currentCountry.code) === geoId || String(currentCountry.isoCode) === geoId
        );

        // Current entity styling - bright red with no border for maximum visibility
        if (isCurrent) {
            const style = { 
                fill: "#FF4D4D",           // Bright red
                stroke: "transparent",      // No border
                strokeWidth: 0,
                outline: "none",
                strokeOpacity: 0
            };
            return {
                default: style,
                hover: style,    // Same style on hover
                pressed: style   // Same style when clicked
            };
        } 
        // Successfully guessed entities - green with white border
        else if (isGuessed) {
            const style = { 
                fill: "#A8D9A7",      // Light green
                stroke: "#FFFFFF",     // White border
                strokeWidth: 0.5, 
                outline: "none" 
            };
            return {
                default: style,
                hover: style,
                pressed: style
            };
        }

        // --- EUROPE MODE SPECIFIC LOGIC ---
        // Different colors for European vs non-European countries
        if (geoIdProperty === 'ISO_A3') {
            const isEuropean = europeanCountryCodes.includes(geoId);
            
            if (isEuropean) {
                // European countries - medium gray with white border
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
                // Non-European countries - very dark gray, no border
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

        // --- DEFAULT STYLING (for regions mode, etc.) ---
        const style = { 
            fill: '#505050',      // Medium gray
            stroke: '#FFFFFF',    // White borders
            strokeWidth: 0.5, 
            outline: 'none' 
        };
        return {
            default: style,
            hover: style,
            pressed: style
        };
    }, [currentCountry, guessedCountries, geoIdProperty, europeanCountryCodes]);

    // Memoize marker style function
    const getMarkerStyle = useMemo(() => (entityId) => {
        // Check game state for this specific entity
        const isGuessed = guessedCountries.some(c => 
            String(c.code || c.isoCode) === entityId
        );
        const isCurrent = currentCountry && 
            String(currentCountry.code || currentCountry.isoCode) === entityId;

        if (isCurrent) {
            return {
                fill: "#FF4D4D",    // Red for current entity
                stroke: "none",
                strokeWidth: 0,
                radius: 5           // Larger size for current
            };
        } else if (isGuessed) {
            return {
                fill: "#A8D9A7",    // Green for guessed entities
                stroke: "none", 
                strokeWidth: 0,
                radius: 4           // Medium size for guessed
            };
        } else {
            return {
                fill: "#FFFFFF",    // White for unguessed (matches borders)
                stroke: "none",
                strokeWidth: 0,
                radius: 3           // Smallest size for unguessed
            };
        }
    }, [currentCountry, guessedCountries]);

    return (
        <div className="map-container" style={{ width: "100%", height: "100%" }}>
            {/* Main map component with azimuthal equal-area projection */}
            <ComposableMap 
                projection="geoAzimuthalEqualArea" 
                projectionConfig={currentProjection}
            >
                {/* Geographic regions rendering */}
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

                {/* Markers for micro-states - only shown in Europe mode */}
                {isEuropeMode && Object.entries(MARKER_COORDINATES).map(([entityId, coordinates]) => {
                    // Check game state for this micro-state
                    const isCurrent = currentCountry && 
                        String(currentCountry.code || currentCountry.isoCode) === entityId;
                    const isGuessed = guessedCountries.some(c => 
                        String(c.code || c.isoCode) === entityId
                    );
                    
                    // Only show marker if it's the current entity or has been guessed
                    // This prevents showing all micro-states at once (would be confusing)
                    if (!isCurrent && !isGuessed) {
                        return null;
                    }
                    
                    const markerStyle = getMarkerStyle(entityId);
                    return (
                        <Marker key={entityId} coordinates={coordinates}>
                            {/* Simple circle marker with drop shadow for visibility */}
                            <circle 
                                cx="0"
                                cy="0"
                                r={markerStyle.radius}
                                fill={markerStyle.fill}
                                stroke={markerStyle.stroke}
                                strokeWidth={markerStyle.strokeWidth}
                                style={{
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' // Shadow for better visibility
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
