// Specialized hook for game statistics tracking
// Follows Interface Segregation Principle - only handles statistics
import { useState, useMemo } from 'react';

export const useGameStatistics = () => {
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [skipsUsed, setSkipsUsed] = useState(0);
    const [successfulGuesses, setSuccessfulGuesses] = useState(0);

    // Calculate accuracy percentage automatically
    const accuracy = useMemo(() => {
        return totalGuesses > 0 ? 
            ((successfulGuesses / totalGuesses) * 100).toFixed(1) : 0;
    }, [totalGuesses, successfulGuesses]);

    // Reset all statistics
    const resetStatistics = () => {
        setTotalGuesses(0);
        setHintsUsed(0);
        setSkipsUsed(0);
        setSuccessfulGuesses(0);
    };

    // Increment methods
    const incrementGuesses = () => setTotalGuesses(prev => prev + 1);
    const incrementHints = () => setHintsUsed(prev => prev + 1);
    const incrementSkips = () => setSkipsUsed(prev => prev + 1);
    const incrementSuccessfulGuesses = () => setSuccessfulGuesses(prev => prev + 1);

    return {
        // Statistics state
        totalGuesses,
        hintsUsed,
        skipsUsed,
        successfulGuesses,
        accuracy,
        
        // Actions
        incrementGuesses,
        incrementHints,
        incrementSkips,
        incrementSuccessfulGuesses,
        resetStatistics
    };
}; 