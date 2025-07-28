// Specialized hook for core game state management
// Follows Interface Segregation Principle - only handles state, not actions
// Now completely agnostic to game modes - works with any entities from GameManager
import { useState, useEffect, useCallback, useMemo } from 'react';

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Generic game state hook - works with any entities provided by GameManager
 * @param {Array} entities - Array of entities to guess (from GameManager.getEntities())
 * @returns {Object} Game state and actions
 */
export const useGameState = (entities = []) => {
    const [entitiesToGuess, setEntitiesToGuess] = useState([]);
    const [guessedEntities, setGuessedEntities] = useState([]);
    const [gameEnded, setGameEnded] = useState(false);
    
    // Stabilize entities to prevent infinite loops
    const stableEntities = useMemo(() => entities, [JSON.stringify(entities)]);
    const entitiesLength = stableEntities.length;

    // Derived state - agnostic to entity type
    const currentEntity = entitiesToGuess[0] || null;
    const totalEntities = entitiesLength;

    // Stable initialize game function
    const initializeGame = useCallback(() => {
        if (entitiesLength > 0) {
            const shuffled = shuffleArray(stableEntities);
            setEntitiesToGuess(shuffled);
            setGuessedEntities([]);
            setGameEnded(false);
        }
    }, [stableEntities, entitiesLength]);

    // Move entity from pending to guessed
    const markEntityAsGuessed = useCallback((entity) => {
        setGuessedEntities(prev => [...prev, entity]);
        setEntitiesToGuess(prev => prev.slice(1));
    }, []);

    // Move current entity to end of queue
    const skipCurrentEntity = useCallback(() => {
        setEntitiesToGuess(prev => {
            if (prev.length <= 1) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    }, []);

    // Reset game state
    const resetGameState = useCallback(() => {
        setEntitiesToGuess([]);
        setGuessedEntities([]);
        setGameEnded(false);
    }, []);

    // Check for game end conditions - only check based on internal state
    useEffect(() => {
        if (entitiesToGuess.length === 0 && guessedEntities.length > 0 && !gameEnded) {
            setGameEnded(true);
        }
    }, [entitiesToGuess.length, guessedEntities.length, gameEnded]);

    return {
        // State - generic entity naming
        currentEntity,
        currentCountry: currentEntity, // Legacy compatibility
        guessedEntities,
        guessedCountries: guessedEntities, // Legacy compatibility
        entitiesToGuess,
        countriesToGuess: entitiesToGuess, // Legacy compatibility
        gameEnded,
        totalEntities,
        totalCountries: totalEntities, // Legacy compatibility
        
        // Actions
        initializeGame,
        markEntityAsGuessed,
        skipCurrentEntity,
        resetGameState,
        setGameEnded
    };
}; 