/**
 * GameManager - Service central pour la gestion des modes de jeu
 * Centralise : modes, entités, cartes, règles, feedbacks, timer
 */
import { normalizeString } from '../../shared/data/entities.js';

class GameManager {
  constructor() {
    this.soloModes = {};
    this.multiplayerModes = {};
  }

  // === GESTION DES MODES ===
  
  /**
   * Récupère un mode de jeu
   * @param {string} modeKey - Clé du mode (ex: 'europe', 'fastest')
   * @param {boolean} isMultiplayer - Si c'est un mode multijoueur
   * @returns {Object} Configuration du mode
   */
  getMode(modeKey, isMultiplayer = false) {
    const modes = isMultiplayer ? this.multiplayerModes : this.soloModes;
    return modes[modeKey] || null;
  }

  /**
   * Liste tous les modes disponibles
   * @param {boolean} isMultiplayer - Si on veut les modes multijoueur
   * @returns {Array} Liste des modes avec leurs infos
   */
  listModes(isMultiplayer = false) {
    const modes = isMultiplayer ? this.multiplayerModes : this.soloModes;
    return Object.entries(modes).map(([key, config]) => ({
      key,
      label: config.label,
      modeType: config.modeType || 'classic',
      scoreType: config.scoreType
    }));
  }

  // === GESTION DES ENTITÉS ===
  
  /**
   * Récupère les entités d'un mode
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Array} Liste des entités
   */
  getEntities(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    return mode ? mode.entities : [];
  }

  /**
   * Valide une réponse contre une entité - logique identique au serveur
   * @param {string} guess - Réponse du joueur
   * @param {Object} entity - Entité à deviner
   * @returns {boolean} Vrai si correct
   */
  validateAnswer(guess, entity) {
    if (!guess || !entity) return false;
    
    const normalizedGuess = normalizeString(guess);
    
    // Vérifier le nom principal
    if (normalizeString(entity.name) === normalizedGuess) {
      return true;
    }
    
    // Vérifier les noms alternatifs
    return entity.altNames?.some(altName => 
      normalizeString(altName) === normalizedGuess
    ) || false;
  }

  // === GESTION DES CARTES ===
  
  /**
   * Récupère le chemin du fichier GeoJSON
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {string} Chemin vers le fichier GeoJSON
   */
  getGeoJsonPath(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    return mode ? `/geojson/${mode.geoJsonFile}` : '';
  }

  /**
   * Récupère les chemins GeoJSON pour les zones multiples
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Array} Chemins vers les fichiers GeoJSON des zones
   */
  getZonesGeoJsonPaths(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode?.zones) return [];
    
    return mode.zones.map(zone => ({
      ...zone,
      geoJson: `/geojson/${zone.geoJsonFile}`
    }));
  }

  /**
   * Récupère la config de projection pour la carte
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Object} Config de projection
   */
  getProjectionConfig(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    return mode ? mode.projectionConfig : {};
  }

  // === GESTION DU TIMER ===
  
  /**
   * Récupère la config du timer
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Object} Config timer {type, seconds}
   */
  getTimerConfig(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode) return { type: 'countdown', seconds: 180 };
    
    return {
      type: mode.timerType || 'countdown',
      seconds: mode.timerSeconds || 180
    };
  }

  /**
   * Détermine si le timer doit être affiché
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {boolean}
   */
  shouldShowTimer(modeKey, isMultiplayer = false) {
    const config = this.getTimerConfig(modeKey, isMultiplayer);
    return config.type !== 'none';
  }

  // === GESTION DES RÈGLES DE VICTOIRE ===
  
  /**
   * Vérifie si les conditions de victoire sont remplies
   * @param {string} modeKey 
   * @param {Object} gameState - État actuel du jeu
   * @param {boolean} isMultiplayer 
   * @returns {Object} {isVictory: boolean, message: string}
   */
  checkVictoryCondition(modeKey, gameState, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode) return { isVictory: false, message: '' };

    const condition = mode.victoryCondition || 'all_entities';
    const feedbacks = mode.feedbackMessages || {};

    switch (condition) {
      case 'all_entities':
        const totalEntities = mode.entities.length;
        const guessedCount = gameState.guessedCountries?.length || 0;
        const isVictory = guessedCount >= totalEntities;
        return {
          isVictory,
          message: isVictory ? feedbacks.victory : ''
        };

      case 'score_threshold':
        const threshold = mode.scoreThreshold || 10;
        const playerScore = Math.floor((gameState.playerScore || 0) / 10);
        const isWin = playerScore >= threshold;
        return {
          isVictory: isWin,
          message: isWin ? feedbacks.victory : ''
        };

      case 'time_based':
        // Implémentation future pour modes basés sur le temps
        return { isVictory: false, message: '' };

      default:
        return { isVictory: false, message: '' };
    }
  }

  // === GESTION DES FEEDBACKS ===
  
  /**
   * Récupère un message de feedback
   * @param {string} modeKey 
   * @param {string} messageType - 'victory', 'defeat', 'hint', 'correctAnswer'
   * @param {boolean} isMultiplayer 
   * @param {Object} context - Contexte additionnel (nom du pays, etc.)
   * @returns {string} Message formaté
   */
  getFeedbackMessage(modeKey, messageType, isMultiplayer = false, context = {}) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode || !mode.feedbackMessages) return '';

    const baseMessage = mode.feedbackMessages[messageType] || '';
    
    // Formatter le message avec le contexte
    if (messageType === 'hint' && context.firstLetter) {
      return `${baseMessage} "${context.firstLetter}"`;
    }
    
    if (messageType === 'correctAnswer' && context.countryName) {
      return `${baseMessage} ${context.countryName} !`;
    }
    
    return baseMessage;
  }

  // === GESTION DE L'UI ===
  
  /**
   * Récupère les options d'UI d'un mode
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Object} Options UI {showHint, showSkip, scoreType, etc.}
   */
  getUIOptions(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode) return {};

    return {
      showHint: mode.showHint !== false,
      showSkip: mode.showSkip !== false,
      scoreType: mode.scoreType || 'stars',
      timerType: mode.timerType || 'countdown'
    };
  }

  /**
   * Récupère les personnalisations d'UI d'un mode
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Object} Customisations UI {colors, icons, styles, etc.}
   */
  getUICustomization(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode) return {};

    return {
      primaryColor: mode.primaryColor || '#4169E1',
      secondaryColor: mode.secondaryColor || '#5a7bff',
      icon: mode.icon || '🌍',
      buttonStyle: mode.buttonStyle || 'default',
      mapTheme: mode.mapTheme || 'default',
      placeholder: mode.customPlaceholder || null,
      headerTitle: mode.headerTitle || mode.label,
      successSound: mode.successSound || null,
      backgroundImage: mode.backgroundImage || null,
      ...mode.uiCustomization // Allow any additional UI customizations
    };
  }

  // === UTILITAIRES ===
  
  /**
   * Récupère une entité par son nom
   * @param {string} modeKey 
   * @param {string} entityName 
   * @param {boolean} isMultiplayer 
   * @returns {Object|null} Entité trouvée
   */
  findEntityByName(modeKey, entityName, isMultiplayer = false) {
    const entities = this.getEntities(modeKey, isMultiplayer);
    return entities.find(entity => 
      normalizeString(entity.name) === normalizeString(entityName)
    ) || null;
  }

  /**
   * Mélange les entités d'un mode
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {Array} Entités mélangées
   */
  getShuffledEntities(modeKey, isMultiplayer = false) {
    const entities = [...this.getEntities(modeKey, isMultiplayer)];
    for (let i = entities.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entities[i], entities[j]] = [entities[j], entities[i]];
    }
    return entities;
  }
}

// Instance singleton
const gameManager = new GameManager();
export default gameManager; 