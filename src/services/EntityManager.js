/**
 * EntityManager - Responsabilité UNIQUE : Gestion des entités de jeu
 * Respecte le Single Responsibility Principle
 */
import { normalizeString } from '../../shared/data/entities.js';

class EntityManager {
  /**
   * Récupère les entités d'un mode
   * @param {Object} mode - Configuration du mode
   * @returns {Array} Liste des entités
   */
  getEntities(mode) {
    if (!mode || !mode.entities) return [];
    return mode.entities;
  }

  /**
   * Mélange les entités de manière aléatoire
   * @param {Object} mode - Configuration du mode
   * @returns {Array} Entités mélangées
   */
  getShuffledEntities(mode) {
    const entities = this.getEntities(mode);
    const shuffled = [...entities];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Trouve une entité par son nom
   * @param {Object} mode - Configuration du mode
   * @param {string} entityName - Nom à rechercher
   * @returns {Object|null} Entité trouvée ou null
   */
  findEntityByName(mode, entityName) {
    const entities = this.getEntities(mode);
    const normalized = normalizeString(entityName);
    
    return entities.find(entity => {
      const mainName = normalizeString(entity.name);
      if (mainName === normalized) return true;
      
      if (entity.altNames && entity.altNames.length > 0) {
        return entity.altNames.some(altName => 
          normalizeString(altName) === normalized
        );
      }
      
      return false;
    }) || null;
  }

  /**
   * Valide une réponse contre une entité
   * @param {string} guess - Réponse de l'utilisateur
   * @param {Object} entity - Entité à deviner
   * @returns {boolean} True si correct
   */
  validateAnswer(guess, entity) {
    if (!guess || !entity) return false;
    
    const normalizedGuess = normalizeString(guess);
    const normalizedName = normalizeString(entity.name);
    
    // Vérifier le nom principal
    if (normalizedGuess === normalizedName) return true;
    
    // Vérifier les noms alternatifs
    if (entity.altNames && entity.altNames.length > 0) {
      return entity.altNames.some(altName => 
        normalizeString(altName) === normalizedGuess
      );
    }
    
    return false;
  }

  /**
   * Obtient le nombre total d'entités pour un mode
   * @param {Object} mode - Configuration du mode
   * @returns {number} Nombre d'entités
   */
  getEntityCount(mode) {
    const entities = this.getEntities(mode);
    return entities.length;
  }
}

export default new EntityManager(); 