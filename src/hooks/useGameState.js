// Specialized hook for core game state management
// Follows Interface Segregation Principle - only handles state, not actions
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const useGameState = (entities = []) => {
    const [countriesToGuess, setCountriesToGuess] = useState([]);
    const [guessedCountries, setGuessedCountries] = useState([]);
    const [gameEnded, setGameEnded] = useState(false);
    
    // Stabilize entities to prevent infinite loops
    const stableEntities = useMemo(() => entities, [JSON.stringify(entities)]);
    const entitiesLength = stableEntities.length;

    // Derived state
    const currentCountry = countriesToGuess[0] || null;
    const totalCountries = entitiesLength;

    // Stable initialize game function
    const initializeGame = useCallback(() => {
        if (entitiesLength > 0) {
            const shuffled = shuffleArray(stableEntities);
            setCountriesToGuess(shuffled);
            setGuessedCountries([]);
            setGameEnded(false);
        }
    }, [stableEntities, entitiesLength]);

    // Move entity from pending to guessed
    const markEntityAsGuessed = useCallback((entity) => {
        setGuessedCountries(prev => [...prev, entity]);
        setCountriesToGuess(prev => prev.slice(1));
    }, []);

    // Move current entity to end of queue
    const skipCurrentEntity = useCallback(() => {
        setCountriesToGuess(prev => {
            if (prev.length <= 1) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    }, []);

    // Check for game end conditions - only check based on internal state
    useEffect(() => {
        if (countriesToGuess.length === 0 && guessedCountries.length > 0 && !gameEnded) {
            setGameEnded(true);
        }
    }, [countriesToGuess.length, guessedCountries.length, gameEnded]);

    return {
        // State
        currentCountry,
        guessedCountries,
        countriesToGuess,
        gameEnded,
        totalCountries,
        
        // Actions
        initializeGame,
        markEntityAsGuessed,
        skipCurrentEntity,
        setGameEnded
    };
}; 