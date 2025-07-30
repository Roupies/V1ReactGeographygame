// src/components/game/MapChart/MapChart.jsx
// Interactive map component using react-simple-maps for geography visualization
// Handles country/region highlighting, micro-states markers, and responsive design
import React, { useState, useEffect, useMemo } from "react";
// Importez uniquement ComposableMap, Geographies, Geography, Marker
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"; 
// ✅ CORRIGÉ : Import via GameManager au lieu d'import direct
import gameManager from '../../../services/GameManager';

// Cache mobile-friendly avec gestion mémoire
const geoJSONCache = new Map();
const loadingPromises = new Map();
const MAX_CACHE_SIZE = 3; // Limiter à 3 fichiers en cache sur mobile

// Rendre le cache global accessible pour le préchargement
if (typeof window !== 'undefined') {
    window.geoJSONCache = geoJSONCache;
}

// Fonction pour nettoyer le cache si nécessaire
const cleanCache = () => {
    if (geoJSONCache.size > MAX_CACHE_SIZE) {
        const firstKey = geoJSONCache.keys().next().value;
        geoJSONCache.delete(firstKey);
        console.log('🗑️ Cache cleaned (mobile optimization)');
    }
};

// Fetch avec retry et timeout adapté mobile
const fetchWithRetry = async (url, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeout = attempt === 0 ? 8000 : 15000; // Timeout plus long sur retry
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Cache-Control': 'max-age=1800' // 30 min sur mobile
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt === retries) throw error;
            
            // Attendre plus longtemps entre les retries sur mobile
            await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
            console.warn(`📱 Retry ${attempt + 1}/${retries} for ${url}`);
        }
    }
};

// European subregions for potential future filtering
const EUROPEAN_SUBREGIONS = [
    "Western Europe",
    "Eastern Europe",
    "Southern Europe",
    "Northern Europe",
    "Central Europe" 
];

// Color scheme will be dynamically set from theme

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
const DEFAULT_PROJECTION = { rotate: [-5.0, -30.0, 0], scale: 300 }; // Dézoomé et focus vers le nord
const TABLET_PROJECTION = { 
    rotate: [-8.0, -45.0, 0], // Focus vers le nord
    scale: 550, // Dézoomé pour éviter l'empiètement sur les pays nordiques
    center: [0, 0]
};
const MOBILE_PROJECTION = { 
    rotate: [-8.0, -45.0, 0], // Focus vers le nord
    scale: 850,              // Dézoomé pour éviter l'empiètement
    center: [0, 0]            // Centered instead of offset
};

// Main MapChart component - receives game state and configuration as props
const MapChart = ({ 
    currentCountry,      // Entity currently being guessed (highlighted in red)
    guessedCountries,    // Array of successfully guessed entities (shown in green)
    geoJsonPath,         // Path to GeoJSON data file
    geoIdProperty = 'ISO_A3',  // Property name for matching entities (ISO_A3 for countries, code for regions)
    projectionConfig,    // Map projection settings from game configuration
    theme,              // Theme colors
    gameConfig,         // ✅ AJOUTÉ : Configuration de jeu depuis GameManager
    selectedMode,       // ✅ AJOUTÉ : Mode sélectionné pour GameManager
    isMultiplayer       // ✅ AJOUTÉ : Mode multijoueur pour GameManager
}) => { 
    // State for managing responsive map projection
    const [currentProjection, setCurrentProjection] = useState(projectionConfig || DEFAULT_PROJECTION);
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load GeoJSON data with mobile-optimized cache
    useEffect(() => {
        console.log('📱 Mobile-optimized GeoJSON loading:', geoJsonPath);
        setLoading(true);
        setError(null);
        
        // Check cache first
        if (geoJSONCache.has(geoJsonPath)) {
            console.log('📦 From cache:', geoJsonPath);
            setGeoData(geoJSONCache.get(geoJsonPath));
            setLoading(false);
            return;
        }
        
        // Check if already loading
        if (loadingPromises.has(geoJsonPath)) {
            console.log('⏳ Already loading:', geoJsonPath);
            loadingPromises.get(geoJsonPath)
                .then(data => {
                    setGeoData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
            return;
        }
        
        // Load with timeout and retry for mobile networks
        const loadingPromise = fetchWithRetry(geoJsonPath);
        loadingPromises.set(geoJsonPath, loadingPromise);
        
        loadingPromise
            .then(data => {
                cleanCache(); // Nettoyer si nécessaire
                geoJSONCache.set(geoJsonPath, data);
                loadingPromises.delete(geoJsonPath);
                setGeoData(data);
                setLoading(false);
            })
            .catch(err => {
                loadingPromises.delete(geoJsonPath);
                setError(err.message);
                setLoading(false);
            });
    }, [geoJsonPath]);

    // Responsive design handler - only update when projectionConfig actually changes
    useEffect(() => {
        if (projectionConfig) {
            setCurrentProjection(projectionConfig);
            }
    }, [projectionConfig]);

    // ✅ CORRIGÉ : Utilise GameManager au lieu d'import direct
    const europeanCountryCodes = useMemo(() => {
        if (!selectedMode || !gameConfig) return [];
        
        const entities = gameManager.getEntities(selectedMode, isMultiplayer);
        const codes = entities.map(c => String(c.isoCode));
        
        // Ajouter les variantes possibles pour le Kosovo si on est en mode Europe
        if (selectedMode.includes('europe')) {
            codes.push('XKX', 'KOS', 'XK', 'KX', '-99'); // Différents codes possibles pour le Kosovo
        }
        return codes;
    }, [selectedMode, gameConfig, isMultiplayer]);
    
    // ✅ CORRIGÉ : Determine if we're in Europe mode via GameManager
    const isEuropeMode = selectedMode?.includes('europe') && geoIdProperty === 'ISO_A3';

    // Debug info for mobile optimizations (only in development)
    const debugInfo = process.env.NODE_ENV === 'development' && (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            zIndex: 1001,
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                🚀 Mobile Optimizations
            </div>
            <div>📦 Cache: {geoJSONCache.size}/{MAX_CACHE_SIZE}</div>
            <div>⏳ Loading: {loadingPromises.size}</div>
            <div>📱 Mobile: {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '✅ Yes' : '❌ No'}</div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#FFD700' }}>
                {geoJsonPath.includes('europe') ? '🗺️ Europe Map' : 
                 geoJsonPath.includes('france') ? '🇫🇷 France Map' : '🗺️ Other Map'}
            </div>
        </div>
    );

    // Memoize style function to prevent recreation on every render
    const getCountryStyle = useMemo(() => (geo) => {
        const geoId = String(geo.properties[geoIdProperty]);
        

        
        // Check if this entity has been successfully guessed
        const isGuessed = Array.isArray(guessedCountries) && guessedCountries.some(c => {
            const codeMatch = String(c.code) === geoId;
            const isoMatch = String(c.isoCode) === geoId;
            const matches = codeMatch || isoMatch;
            
            return matches;
        });
        
        // Check if this is the current entity to guess
        const isCurrent = currentCountry && (
            String(currentCountry.code) === geoId || String(currentCountry.isoCode) === geoId
        );

        // Current entity styling - themed current color
        if (isCurrent) {
            const style = { 
                fill: theme?.colors?.countryCurrent || "#FF4D4D",
                stroke: "transparent",
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
        // Successfully guessed entities - themed guessed color
        else if (isGuessed) {
            const style = { 
                fill: theme?.colors?.countryGuessed || "#A8D9A7",
                stroke: theme?.colors?.countryBorder || "#FFFFFF",
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
            
            // Liste des pays non-européens qui touchent la mer (pour bordure blanche)
            const coastalNonEuropeanCountries = [
                'DZA', // Algérie
                'TUN', // Tunisie
                'LBY', // Libye
                'EGY', // Égypte
                'ISR', // Israël
                'LBN', // Liban
                'SYR', // Syrie
                'TUR', // Turquie
                'GEO', // Géorgie
                'AZE', // Azerbaïdjan
                'KAZ', // Kazakhstan
                'TKM', // Turkménistan
                'IRN', // Iran
                'IRQ', // Irak
                'SAU', // Arabie Saoudite
                'YEM', // Yémen
                'OMN', // Oman
                'ARE', // Émirats Arabes Unis
                'QAT', // Qatar
                'BHR', // Bahreïn
                'KWT', // Koweït
                'JOR', // Jordanie
                'MAR', // Maroc
                'ESH', // Sahara Occidental
                'MRT', // Mauritanie
                'SEN', // Sénégal
                'GMB', // Gambie
                'GNB', // Guinée-Bissau
                'GIN', // Guinée
                'SLE', // Sierra Leone
                'LBR', // Libéria
                'CIV', // Côte d'Ivoire
                'GHA', // Ghana
                'TGO', // Togo
                'BEN', // Bénin
                'NGA', // Nigeria
                'CMR', // Cameroun
                'GNQ', // Guinée équatoriale
                'GAB', // Gabon
                'COG', // République du Congo
                'COD', // République démocratique du Congo
                'AGO', // Angola
                'NAM', // Namibie
                'ZAF', // Afrique du Sud
                'LSO', // Lesotho
                'SWZ', // Eswatini
                'MOZ', // Mozambique
                'ZWE', // Zimbabwe
                'BWA', // Botswana
                'ZMB', // Zambie
                'MWI', // Malawi
                'TZA', // Tanzanie
                'KEN', // Kenya
                'SOM', // Somalie
                'ETH', // Éthiopie
                'ERI', // Érythrée
                'DJI', // Djibouti
                'SDN', // Soudan
                'SSD', // Soudan du Sud
                'CAF', // République centrafricaine
                'TCD', // Tchad
                'NER', // Niger
                'MLI', // Mali
                'BFA', // Burkina Faso
                'CIV', // Côte d'Ivoire
                'GHA', // Ghana
                'TGO', // Togo
                'BEN', // Bénin
                'NGA', // Nigeria
                'CMR', // Cameroun
                'GNQ', // Guinée équatoriale
                'GAB', // Gabon
                'COG', // République du Congo
                'COD', // République démocratique du Congo
                'AGO', // Angola
                'NAM', // Namibie
                'ZAF', // Afrique du Sud
                'LSO', // Lesotho
                'SWZ', // Eswatini
                'MOZ', // Mozambique
                'ZWE', // Zimbabwe
                'BWA', // Botswana
                'ZMB', // Zambie
                'MWI', // Malawi
                'TZA', // Tanzanie
                'KEN', // Kenya
                'SOM', // Somalie
                'ETH', // Éthiopie
                'ERI', // Érythrée
                'DJI', // Djibouti
                'SDN', // Soudan
                'SSD', // Soudan du Sud
                'CAF', // République centrafricaine
                'TCD', // Tchad
                'NER', // Niger
                'MLI', // Mali
                'BFA', // Burkina Faso
            ];
            
            const isCoastalNonEuropean = coastalNonEuropeanCountries.includes(geoId);
            
            if (isEuropean) {
                // European countries - themed default color
                const style = {
                    fill: theme?.colors?.countryDefault || "#505050",
                    stroke: theme?.colors?.countryBorder || "#FFFFFF",
                    strokeWidth: 1.0,
                    outline: "none"
                };
                return {
                    default: style,
                    hover: style,
                    pressed: style
                };
            } else if (isCoastalNonEuropean) {
                // Non-European coastal countries - bordure blanche SEULEMENT avec la mer
                const style = {
                    fill: theme?.colors?.countryNonEuropean || "#232323",
                    stroke: "#FFFFFF", // Bordure blanche extra épaisse pour les côtes (mer)
                    strokeWidth: 4.0,
                    outline: "none"
                };
                return {
                    default: style,
                    hover: style,
                    pressed: style
                };
            } else {
                // Non-European non-coastal countries - bordure très marquée (pour les frontières terrestres)
                const style = {
                    fill: theme?.colors?.countryNonEuropean || "#232323",
                    stroke: "#FFFFFF", // Bordure blanche très marquée pour les frontières
                    strokeWidth: 2.5,
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
            fill: theme?.colors?.countryDefault || '#505050',
            stroke: theme?.colors?.countryBorder || '#FFFFFF',
            strokeWidth: 0.5, 
            outline: 'none' 
        };
        return {
            default: style,
            hover: style,
            pressed: style
        };
    }, [currentCountry, guessedCountries, geoIdProperty, europeanCountryCodes, theme]);

    // Memoize marker style function
    const getMarkerStyle = useMemo(() => (entityId) => {
        // Check game state for this specific entity
        const isGuessed = Array.isArray(guessedCountries) && guessedCountries.some(c => 
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
                fill: "#B3D9E6",    // Blue for guessed micro-states
                stroke: "#0B6B89", // Couleur de contour demandée
                strokeWidth: 1,     // Contour fin
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
        <div className="map-container" style={{ 
            width: "100%", 
            height: "100%",
            backgroundColor: theme?.colors?.mapBackground || '#f5f5f5',
            backgroundImage: theme?.colors?.mapBackgroundImage || 'none',
            backgroundSize: '60px 60px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            position: 'relative'
        }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.95)',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: '120px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }}></div>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        Chargement...
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#999',
                        marginTop: '4px'
                    }}>
                        {geoJsonPath.includes('europe') ? 'Carte Europe' : 
                         geoJsonPath.includes('france') ? 'Carte France' : 'Carte'}
                    </div>
                </div>
            )}
            
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ff4444',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    Erreur de chargement: {error}
                </div>
            )}
            
            {!loading && !error && geoData && (
            <ComposableMap 
                projection="geoAzimuthalEqualArea" 
                projectionConfig={currentProjection}
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: '100%'
                }}
            >
                {/* Geographic regions rendering */}
                    <Geographies geography={geoData}>
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
                        const isGuessed = Array.isArray(guessedCountries) && guessedCountries.some(c => 
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
            )}
            {debugInfo}
        </div>
    );
};

export default MapChart;
