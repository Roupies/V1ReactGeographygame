// Dual Map Chart component for displaying multiple geographic zones
// Used for modes that require multiple maps (e.g., France + DOM-TOM)
import React from 'react';
import MapChart from './MapChart';
import gameManager from '../../../services/GameManager';
import './DualMapChart.css';

const DualMapChart = ({
    gameConfig,
    currentCountry,
    guessedCountries,
    projectionConfig, // This will be ignored since each zone has its own
    theme
}) => {
    // Verify that the game config supports dual maps
    if (!gameConfig?.zones || !Array.isArray(gameConfig.zones)) {
        console.error('DualMapChart requires gameConfig.zones array');
        return <div>Configuration error: Missing zones data</div>;
    }

    const { zones, layout } = gameConfig;

    // Get zones with proper GeoJSON paths
    const zonesWithPaths = zones.map(zone => ({
        ...zone,
        geoJson: `/geojson/${zone.geoJsonFile}`
    }));

    // Determine which zone contains the current country
    const getCurrentZoneForCountry = (country) => {
        if (!country) return null;
        
        return zonesWithPaths.find(zone => 
            zone.regionCodes.includes(country.code)
        );
    };

    const currentZone = getCurrentZoneForCountry(currentCountry);

    return (
        <div className={`dual-map-container ${layout?.orientation || 'horizontal'} ${gameConfig?.label?.includes('régions françaises') ? 'france-complete' : ''}`}>
            {zonesWithPaths.map((zone, index) => {
                // Determine if this zone contains the current country
                const isActiveZone = currentZone?.name === zone.name;
                
                // Filter guessed countries for this zone
                const guessedInThisZone = guessedCountries.filter(country =>
                    zone.regionCodes.includes(country.code)
                );

                // Create CSS-safe class name
                const zoneClass = zone.name === "DOM-TOM" ? "dom-tom" : zone.name.toLowerCase();
                
                return (
                    <div 
                        key={zone.name} 
                        className={`map-zone ${zoneClass} ${isActiveZone ? 'active' : ''}`}
                    >
                        <div className="zone-label">{zone.name}</div>
                        <MapChart
                            // Only highlight current country if it's in this zone
                            currentCountry={isActiveZone ? currentCountry : null}
                            guessedCountries={guessedInThisZone}
                            geoJsonPath={zone.geoJson}
                            geoIdProperty={gameConfig.geoIdProperty}
                            projectionConfig={zone.projectionConfig}
                            theme={theme}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default DualMapChart; 