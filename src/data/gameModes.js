// Game modes configuration - refactored to use GameManager
// This modular approach allows easy addition of new game modes without code changes
import { EUROPEAN_COUNTRIES, FRENCH_REGIONS } from '../../shared/data/entities.js';
import gameManager from '../services/GameManager';

// Mode configurations for GameManager
// These define the data and rules for each game mode
const MODE_CONFIGS = {
  // European Countries Mode
  europe: {
    label: "Pays d'Europe",
    entities: EUROPEAN_COUNTRIES,
    geoJsonFile: 'europe.json',
    geoIdProperty: 'ISO_A3',
    unitLabel: 'pays',
    projectionConfig: { 
      rotate: [-8, -50, 0],
      scale: 550
    },
    responsiveProjection: {
      mobileScale: 1000,
      mobileRotate: [-8, -50, 0]
    },
    victoryCondition: 'all_entities',
    feedbackMessages: {
      victory: 'Félicitations ! Vous avez trouvé tous les pays d\'Europe !',
      hint: 'Ce pays commence par la lettre',
      correctAnswer: 'Correct ! C\'était bien'
    },
    showHint: true,
    showSkip: true,
    scoreType: 'stars',
    timerType: 'countdown'
  },

  // French Complete Mode - Dual map with DOM-TOM and Metropole
  franceComplete: {
    label: "Toutes les régions françaises",
    entities: FRENCH_REGIONS,
    unitLabel: 'région',
    geoIdProperty: 'code',
    victoryCondition: 'all_entities',
    feedbackMessages: {
      victory: 'Félicitations ! Vous avez trouvé toutes les régions françaises !',
      hint: 'Cette région commence par la lettre',
      correctAnswer: 'Correct ! C\'était bien'
    },
    showHint: true,
    showSkip: true,
    scoreType: 'stars',
    timerType: 'countdown',
    zones: [
      {
        name: "DOM-TOM", 
        geoJsonFile: 'domtom.geojson',
        projectionConfig: { 
          rotate: [61, 5, 0],
          scale: 850
        },
        regionCodes: ['01', '02', '03', '04', '06'] // Guadeloupe, Martinique, Guyane, La Réunion, Mayotte
      },
      {
        name: "Métropole",
        geoJsonFile: 'france-metropole.geojson',
        projectionConfig: { 
          rotate: [-2, -46.5, 0],
          scale: 1800
        },
        regionCodes: ['11', '24', '27', '28', '32', '44', '52', '53', '75', '76', '84', '93', '94'] // Toutes les régions métropolitaines
      }
    ],
    layout: {
      type: 'dual',
      orientation: 'horizontal',
      domtomPosition: 'left'
    }
  }
};

// Multiplayer mode configurations
const MULTIPLAYER_MODE_CONFIGS = {
  europe: {
    ...MODE_CONFIGS.europe,
    label: "Pays d'Europe (Multijoueur)",
    scoreType: 'points',
    victoryCondition: 'score_threshold',
    scoreThreshold: 50,
    feedbackMessages: {
      ...MODE_CONFIGS.europe.feedbackMessages,
      victory: 'Partie terminée ! Regardez les scores finaux.',
      playerFound: 'a trouvé',
      playerSkipped: 'a passé'
    },
    // UI Customization for multiplayer
    primaryColor: '#28a745',
    secondaryColor: '#32c252',
    icon: '🌍',
    uiCustomization: {
      buttonGradient: 'linear-gradient(45deg, #28a745, #32c252)',
      hoverEffect: 'glow',
      theme: 'multiplayer-europe'
    }
  },
  
  franceComplete: {
    ...MODE_CONFIGS.franceComplete,
    label: "Toutes les régions françaises (Multijoueur)",
    scoreType: 'points',
    victoryCondition: 'score_threshold',
    scoreThreshold: 40,
    feedbackMessages: {
      ...MODE_CONFIGS.franceComplete.feedbackMessages,
      victory: 'Partie terminée ! Regardez les scores finaux.',
      playerFound: 'a trouvé',
      playerSkipped: 'a passé'
    },
    // UI Customization for multiplayer
    primaryColor: '#6f42c1',
    secondaryColor: '#5a32a3',
    icon: '🗺️',
    uiCustomization: {
      buttonGradient: 'linear-gradient(45deg, #6f42c1, #5a32a3)',
      hoverEffect: 'glow',
      theme: 'multiplayer-france-complete'
    }
  }
};

// Initialisation GameManager
gameManager.soloModes = MODE_CONFIGS;
gameManager.multiplayerModes = MULTIPLAYER_MODE_CONFIGS;

// Export legacy GAME_MODES pour compatibilité éventuelle
export const GAME_MODES = MODE_CONFIGS;

// Export GameManager instance
export default gameManager; 