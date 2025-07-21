// Game modes configuration - defines different geography quiz modes
// This modular approach allows easy addition of new game modes without code changes
import { EUROPEAN_COUNTRIES } from './countries';
import { FRENCH_REGIONS, FRENCH_REGIONS_WITH_NAMES } from './regions';

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
      rotate: [-8, -50, 0],                   // Map rotation [longitude, latitude, roll] - focus plus au sud
      scale: 550                              // Map zoom level - légèrement dézoomé pour voir plus d'Europe
    },
  },
  
  // French Regions Mode - quiz on French metropolitan regions only
  franceRegions: {
    label: "Régions de France métropolitaine", // Display name for mode selection
    entities: FRENCH_REGIONS,                 // Array of regions to guess
    geoJson: '/geojson/france-metropole.geojson', // Path to metropolitan regions only
    getName: entity => entity.name,           // Function to extract region name
    getAltNames: entity => entity.altNames || [], // Function to get alternative names
    unitLabel: 'régions',                     // Label for entities (used in UI messages)
    geoIdProperty: 'code',                    // Property name for matching regions to map
    projectionConfig: { 
      rotate: [-2, -43, 0],                   // Map rotation focused on France
      scale: 1800                             // High zoom level for detailed view
    },
  },

  // French Complete Mode - quiz on all French regions with dual map display
  franceComplete: {
    label: "Toutes les régions françaises",   // Display name for mode selection
    entities: FRENCH_REGIONS,                 // Array of all French regions to guess
    unitLabel: 'régions',                     // Label for entities (used in UI messages)
    getName: entity => entity.name,           // Function to extract region name
    getAltNames: entity => entity.altNames || [], // Function to get alternative names
    geoIdProperty: 'code',                    // Property name for matching regions to map
    
    // Multi-zone configuration for dual map display
    zones: [
      {
        name: "DOM-TOM", 
        geoJson: '/geojson/domtom.geojson',
        projectionConfig: { 
          rotate: [61, 5, 0],                 // Modifié: latitude positive pour remonter
          scale: 850                          // Dézoomé pour voir tous les DOM-TOM
        },
        // Codes des DOM-TOM
        regionCodes: ['01', '02', '03', '04', '06']
      },
      {
        name: "Métropole",
        geoJson: '/geojson/france-metropole.geojson',
        projectionConfig: { 
          rotate: [-2, -46.5, 0],               // Ajusté pour mieux centrer la France
          scale: 1800                           // Corrigé et augmenté pour un meilleur zoom
        },
        // Codes des régions métropolitaines (pour filtrer l'affichage)
        regionCodes: ['11', '24', '27', '28', '32', '44', '52', '53', '75', '76', '84', '93', '94']
      }
    ],
    
    // Layout configuration for dual display
    layout: {
      type: 'dual',                           // Type d'affichage
      orientation: 'horizontal',              // DOM-TOM à gauche, métropole à droite
      domtomPosition: 'left'                  // Position des DOM-TOM
    }
  },

  // French All Regions Mode - quiz on all French regions (metropole + outre-mer) on single map
  franceRegionsAll: {
    label: "Toutes les régions (carte unique)",  // Display name for mode selection
    entities: FRENCH_REGIONS_WITH_NAMES,         // Array adapted for France et Outre-mers.json
    geoJson: '/geojson/France et Outre-mers.json', // Path to France + DOM-TOM file
    getName: entity => entity.name,              // Function to extract region name
    getAltNames: entity => entity.altNames || [], // Function to get alternative names
    unitLabel: 'régions',                        // Label for entities (used in UI messages)
    geoIdProperty: 'Région',                     // Property name for matching regions to map (use region name)
    projectionConfig: { 
      rotate: [-2, -43, 0],                      // Map rotation focused on France
      scale: 800                                 // Zoom level for world view with all territories
    },
  },
  
  // Future modes can be easily added here with the same structure
  // Example: departments, world capitals, US states, etc.
}; 