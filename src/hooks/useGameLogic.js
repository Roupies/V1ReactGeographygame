// Modular game logic hook that composes specialized hooks
// Follows Interface Segregation Principle by using focused hooks
// Follows Single Responsibility Principle by delegating to specialized hooks
// Follows Dependency Inversion Principle by accepting abstractions
// Now uses GameManager for all game logic and validation

import { useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { useGameStatistics } from './useGameStatistics';
import { useGameActions } from './useGameActions';
import { useTimer } from './useTimer';
import gameManager from '../data/gameModes';

const GAME_TIME_SECONDS = 180;

/**
 * Main game logic hook - orchestrates all game functionality using GameManager
 * @param {string} modeKey - Game mode key (e.g., 'europe', 'franceRegions')
 * @param {boolean} isMultiplayer - Whether in multiplayer mode
 * @returns {Object} Complete game logic interface
 */
export const useGameLogic = (modeKey, isMultiplayer = false) => {
    // Get entities from GameManager based on mode
    const entities = modeKey ? gameManager.getEntities(modeKey, isMultiplayer) : [];
    
    // Compose specialized hooks - each with a single responsibility
    const gameState = useGameState(entities);
    const statistics = useGameStatistics();
    const timer = useTimer(GAME_TIME_SECONDS, gameState.gameEnded);
    const actions = useGameActions(gameState, statistics, timer, gameManager, modeKey, isMultiplayer);

    // Handle timer expiration - single responsibility
    useEffect(() => {
        if (timer.timeLeft === 0 && !gameState.gameEnded) {
            gameState.setGameEnded(true);
        }
    }, [timer.timeLeft, gameState.gameEnded, gameState.setGameEnded]);

    // Initialize game when mode changes
    useEffect(() => {
        if (modeKey && entities.length > 0) {
            gameState.initializeGame();
        }
    }, [modeKey, entities.length, gameState.initializeGame]);

    // Fixed reset function with proper dependencies
    const resetGame = useCallback(() => {
        console.log('🔄 Resetting game...');
        
        // Reset in proper order: end game first, then reset all state
        gameState.setGameEnded(false);
        timer.resetTimer();
        statistics.resetStatistics();
        actions.resetInputState();
        gameState.resetGameState();
        
        // Re-initialize with fresh data
        if (modeKey && entities.length > 0) {
            gameState.initializeGame();
        }
        
        console.log('✅ Game reset complete');
    }, [
        gameState.setGameEnded,
        gameState.resetGameState,
        gameState.initializeGame,
        timer.resetTimer,
        statistics.resetStatistics,
        actions.resetInputState,
        modeKey,
        entities.length
    ]);

    // Check victory condition using GameManager
    const checkVictory = useCallback(() => {
        if (!modeKey || gameState.gameEnded) return { isVictory: false, message: '' };
        
        return gameManager.checkVictoryCondition(modeKey, {
            guessedCountries: gameState.guessedEntities,
            playerScore: statistics.accuracy * 10 // Convert accuracy to score
        }, isMultiplayer);
    }, [modeKey, gameState.gameEnded, gameState.guessedEntities, statistics.accuracy, isMultiplayer]);

    return {
        // Game state - maintain legacy compatibility
        currentCountry: gameState.currentEntity,
        currentEntity: gameState.currentEntity,
        guessedCountries: gameState.guessedEntities,
        guessedEntities: gameState.guessedEntities,
        gameEnded: gameState.gameEnded,
        totalCountries: gameState.totalEntities,
        totalEntities: gameState.totalEntities,
        
        // Timer
        timeLeft: timer.timeLeft,
        gameTimeSeconds: timer.gameTimeSeconds,
        formatTime: timer.formatTime,
        
        // Statistics
        totalGuesses: statistics.totalGuesses,
        hintsUsed: statistics.hintsUsed,
        skipsUsed: statistics.skipsUsed,
        accuracy: statistics.accuracy,
        
        // Input and feedback
        guessInput: actions.guessInput,
        setGuessInput: actions.setGuessInput,
        feedbackMessage: actions.feedbackMessage,
        hint: actions.hint,
        isShaking: actions.isShaking,
        
        // Actions
        handleGuess: actions.handleGuess,
        handleSkip: actions.handleSkip,
        handleHint: actions.handleHint,
        handleKeyPress: actions.handleKeyPress,
        initializeGame: gameState.initializeGame,
        resetGame,
        
        // Victory condition
        checkVictory
    };
}; 