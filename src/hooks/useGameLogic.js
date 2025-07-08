// Modular game logic hook that composes specialized hooks
// Follows Interface Segregation Principle by using focused hooks
// Follows Single Responsibility Principle by delegating to specialized hooks
// Follows Dependency Inversion Principle by accepting abstractions

import { useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { useGameStatistics } from './useGameStatistics';
import { useGameActions } from './useGameActions';
import { useTimer } from './useTimer';

const GAME_TIME_SECONDS = 180;

export const useGameLogic = (
    entities = [],
    getName = entity => entity.name,
    getAltNames = entity => entity.altNames || []
) => {
    // Compose specialized hooks - each with a single responsibility
    const gameState = useGameState(entities);
    const statistics = useGameStatistics();
    const timer = useTimer(GAME_TIME_SECONDS, gameState.gameEnded);
    const actions = useGameActions(gameState, statistics, timer, getName, getAltNames);

    // Handle timer expiration - single responsibility
    useEffect(() => {
        if (timer.timeLeft === 0 && !gameState.gameEnded) {
            gameState.setGameEnded(true);
        }
    }, [timer.timeLeft, gameState.gameEnded]);

    // Fixed reset function with proper dependencies
    const resetGame = useCallback(() => {
        console.log('🔄 Resetting game...');

        // Reset in proper order: end game first, then reset everything
        gameState.setGameEnded(false);
        statistics.resetStatistics();
        actions.resetInputState();
        timer.setTimeLeft(GAME_TIME_SECONDS);
        
        // Initialize game after all resets
        setTimeout(() => {
            gameState.initializeGame();
            console.log('✅ Game reset complete!');
        }, 0);
    }, [
        gameState.setGameEnded,
        gameState.initializeGame,
        statistics.resetStatistics,
        actions.resetInputState,
        timer.setTimeLeft
    ]);

    const resetForNewMode = useCallback(() => {
        resetGame();
    }, [resetGame]);

    // Return object without useMemo to avoid dependency issues
    return {
        // Game state (from useGameState)
        currentCountry: gameState.currentCountry,
        guessedCountries: gameState.guessedCountries,
        gameEnded: gameState.gameEnded,
        totalCountries: gameState.totalCountries,

        // Timer (from useTimer)
        timeLeft: timer.timeLeft,
        formatTime: timer.formatTime,
        gameTimeSeconds: GAME_TIME_SECONDS,

        // Actions and input (from useGameActions)
        guessInput: actions.guessInput,
        setGuessInput: actions.setGuessInput,
        feedbackMessage: actions.feedbackMessage,
        hint: actions.hint,
        isShaking: actions.isShaking,
        handleGuess: actions.handleGuess,
        handleSkip: actions.handleSkip,
        handleHint: actions.handleHint,
        handleKeyPress: actions.handleKeyPress,

        // Statistics (from useGameStatistics)
        totalGuesses: statistics.totalGuesses,
        hintsUsed: statistics.hintsUsed,
        skipsUsed: statistics.skipsUsed,
        accuracy: statistics.getAccuracy(gameState.guessedCountries.length),

        // Game management
        initializeGame: gameState.initializeGame,
        resetGame,
        resetForNewMode
    };
}; 