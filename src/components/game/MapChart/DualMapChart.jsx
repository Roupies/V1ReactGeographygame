// Dual Map Chart component for displaying multiple geographic zones
// Used for modes that require multiple maps (e.g., France + DOM-TOM)
import React from 'react';
import MapChart from './MapChart';
import './DualMapChart.css';

const DualMapChart = ({
    gameConfig,
    currentCountry,
    guessedCountries,
    projectionConfig // This will be ignored since each zone has its own
}) => {
    // Verify that the game config supports dual maps
    if (!gameConfig?.zones || !Array.isArray(gameConfig.zones)) {
        console.error('DualMapChart requires gameConfig.zones array');
        return <div>Configuration error: Missing zones data</div>;
    }

    const { zones, layout } = gameConfig;

    // Determine which zone contains the current country
    const getCurrentZoneForCountry = (country) => {
        if (!country) return null;
        
        return zones.find(zone => 
            zone.regionCodes.includes(country.code)
        );
    };

    const currentZone = getCurrentZoneForCountry(currentCountry);

    return (
        <div className={`dual-map-container ${layout?.orientation || 'horizontal'}`}>
            {zones.map((zone, index) => {
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
                        <MapChart
                            // Only highlight current country if it's in this zone
                            currentCountry={isActiveZone ? currentCountry : null}
                            guessedCountries={guessedInThisZone}
                            geoJsonPath={zone.geoJson}
                            geoIdProperty={gameConfig.geoIdProperty}
                            projectionConfig={zone.projectionConfig}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default DualMapChart; 