// Game modes configuration - defines different geography quiz modes
// This modular approach allows easy addition of new game modes without code changes
import { EUROPEAN_COUNTRIES } from './countries';
import { FRENCH_REGIONS } from './regions';
// import { FRENCH_REGIONS } from './regions'; // À créer plus tard

// Main game modes configuration object
// Each mode defines its own entities, visualization, and validation rules
export const GAME_MODES = {
  // European Countries Mode - quiz on European countries using world map
  europe: {
    label: "Pays d'Europe",                    // Display name for mode selection
    entities: EUROPEAN_COUNTRIES,             // Array of countries to guess
    geoJson: '/geojson/europe.json',          // Path to geographic data file
    getName: entity => entity.name,           // Function to extract entity name
    getAltNames: entity => entity.altNames || [], // Function to get alternative names
    unitLabel: 'pays',                        // Label for entities (used in UI messages)
    geoIdProperty: 'ISO_A3',                  // Property name for matching entities to map
    projectionConfig: { 
      rotate: [-5, -35, 0],                   // Map rotation [longitude, latitude, roll]
      scale: 350                              // Map zoom level
    },
  },
  
  // French Regions Mode - quiz on French metropolitan regions
  franceRegions: {
    label: "Régions de France métropolitaine", // Display name for mode selection
    entities: FRENCH_REGIONS,                 // Array of regions to guess
    geoJson: '/geojson/regions.geojson',      // Path to regions geographic data
    getName: entity => entity.name,           // Function to extract region name
    getAltNames: entity => entity.altNames || [], // Function to get alternative names
    unitLabel: 'régions',                     // Label for entities (used in UI messages)
    geoIdProperty: 'code',                    // Property name for matching regions to map
    projectionConfig: { 
      rotate: [-2, -43, 0],                   // Map rotation focused on France
      scale: 1800                             // High zoom level for detailed view
    },
  },
  
  // Future modes can be easily added here with the same structure
  // Example: departments, world capitals, US states, etc.
}; 