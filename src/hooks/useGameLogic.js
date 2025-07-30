// Modular game logic hook that composes specialized hooks
// Follows Interface Segregation Principle by using focused hooks
// Follows Single Responsibility Principle by delegating to specialized hooks
// Follows Dependency Inversion Principle by accepting abstractions
// Now uses GameManager for all game logic and validation

import { useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { useGameStatistics } from './useGameStatistics';
import { useGameActions } from './useGameActions';
import { useGameTimer } from './useGameTimer';
import gameManager from '../data/gameModes';

// ❌ SUPPRIMÉ : Valeur hardcodée remplacée par configuration GameManager
// const GAME_TIME_SECONDS = 240;

/**
 * Main game logic hook - orchestrates all game functionality using GameManager
 * @param {string} modeKey - Game mode key (e.g., 'europe', 'franceRegions')
 * @param {boolean} isMultiplayer - Whether in multiplayer mode
 * @returns {Object} Complete game logic interface
 */
export const useGameLogic = (modeKey, isMultiplayer = false, serverTimeLeft = null) => {
    // Get entities from GameManager based on mode
    const entities = modeKey ? gameManager.getEntities(modeKey, isMultiplayer) : [];
    
    // Compose specialized hooks - each with a single responsibility
    const gameState = useGameState(entities);
    const statistics = useGameStatistics();
    // ✅ NOUVEAU : Timer unifié basé sur configuration GameManager
    const timer = useGameTimer(modeKey, isMultiplayer, gameState.gameEnded, serverTimeLeft);
    const actions = useGameActions(gameState, statistics, timer, gameManager, modeKey, isMultiplayer);

    // Handle timer expiration - single responsibility
    useEffect(() => {
        // ✅ CORRECTION : Vérifications plus strictes pour éviter fin de partie prématurée
        if (timer.isExpired && 
            !gameState.gameEnded && 
            timer.config.timerDisplay && 
            gameState.currentCountry && // S'assurer qu'on a un pays actuel
            entities.length > 0) { // S'assurer que le jeu est initialisé
            console.log('⏰ Timer expired - ending game (mode:', modeKey, ')');
            gameState.setGameEnded(true);
        }
    }, [timer.isExpired, gameState.gameEnded, gameState.setGameEnded, timer.config.timerDisplay, modeKey, gameState.currentCountry, entities.length]);

    // Initialize game when mode changes
    useEffect(() => {
        if (modeKey && entities.length > 0) {
            gameState.initializeGame();
            // ✅ CORRECTION : Reset explicit de gameEnded au début
            gameState.setGameEnded(false);
        }
    }, [modeKey, entities.length, gameState.initializeGame, gameState.setGameEnded]);

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
        timeLeft: timer?.timeLeft || 0,
        gameTimeSeconds: timer?.gameTimeSeconds || gameManager.getTimerConfig(modeKey, isMultiplayer).seconds, // ✅ CORRIGÉ : GameManager au lieu de hardcodé
        formatTime: timer?.formatTime || (() => '00:00'),
        timer: timer, // ✅ NOUVEAU : Exposer le timer complet pour App.jsx
        
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