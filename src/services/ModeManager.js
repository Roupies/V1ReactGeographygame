/**
 * ModeManager - Responsabilité UNIQUE : Gestion des modes de jeu
 * Respecte le Single Responsibility Principle
 */

class ModeManager {
  constructor() {
    this.soloModes = {};
    this.multiplayerModes = {};
  }

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

  /**
   * Enregistre les modes solo
   * @param {Object} modes - Configuration des modes solo
   */
  setSoloModes(modes) {
    this.soloModes = modes;
  }

  /**
   * Enregistre les modes multijoueur
   * @param {Object} modes - Configuration des modes multijoueur
   */
  setMultiplayerModes(modes) {
    this.multiplayerModes = modes;
  }

  /**
   * Vérifie si un mode existe
   * @param {string} modeKey 
   * @param {boolean} isMultiplayer 
   * @returns {boolean}
   */
  hasMode(modeKey, isMultiplayer = false) {
    const modes = isMultiplayer ? this.multiplayerModes : this.soloModes;
    return modes.hasOwnProperty(modeKey);
  }
}

export default new ModeManager(); 