// Specialized hook for game actions and user interactions
// Follows Interface Segregation Principle - only handles actions
// Follows Dependency Inversion Principle - depends on abstractions
// Now uses GameManager for validation and feedback messages
import { useState } from 'react';
import { normalizeString } from '../data/countries';

/**
 * Game actions hook - now uses GameManager for validation and feedback
 * @param {Object} gameState - Game state from useGameState
 * @param {Object} statistics - Statistics from useGameStatistics  
 * @param {Object} timer - Timer from useTimer
 * @param {Object} gameManager - GameManager instance
 * @param {string} modeKey - Current game mode key
 * @param {boolean} isMultiplayer - Whether in multiplayer mode
 * @returns {Object} Actions and input state
 */
export const useGameActions = (
    gameState,
    statistics,
    timer,
    gameManager,
    modeKey,
    isMultiplayer = false
) => {
    const [guessInput, setGuessInput] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [hint, setHint] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    // Process user guess using GameManager validation
    const handleGuess = () => {
        if (gameState.gameEnded || !guessInput.trim()) {
            setFeedbackMessage("Veuillez entrer une réponse.");
            return;
        }

        if (!gameState.currentEntity) {
            setFeedbackMessage("Aucune entité à deviner.");
            return;
        }

        statistics.incrementGuesses();

        // Use GameManager for validation
        const isCorrect = gameManager.validateAnswer(guessInput.trim(), gameState.currentEntity);

        if (isCorrect) {
            // Get feedback message from GameManager
            const correctMessage = gameManager.getFeedbackMessage(
                modeKey, 
                'correctAnswer', 
                isMultiplayer, 
                { countryName: gameState.currentEntity.name }
            );
            setFeedbackMessage(correctMessage || `Bonne réponse ! C'était ${gameState.currentEntity.name}.`);
            
            // Increment successful guesses for statistics
            statistics.incrementSuccessfulGuesses();
            
            gameState.markEntityAsGuessed(gameState.currentEntity);
            setGuessInput('');
            setHint('');
            setIsShaking(false);
        } else {
            setFeedbackMessage(`Faux. Ce n'est pas ${guessInput.trim()}.`);
            setGuessInput('');
            
            // Trigger shake animation
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    // Skip current entity
    const handleSkip = () => {
        if (gameState.gameEnded || !gameState.currentEntity) {
            setFeedbackMessage("Impossible de passer : jeu terminé ou aucune entité disponible.");
            return;
        }
        
        statistics.incrementSkips();
        gameState.skipCurrentEntity();
        setFeedbackMessage("");
        setGuessInput('');
        setHint('');
        setIsShaking(false);
    };

    // Show hint with GameManager feedback
    const handleHint = () => {
        if (gameState.gameEnded || !gameState.currentEntity) {
            setFeedbackMessage("Impossible d'afficher l'indice : jeu terminé ou aucune entité disponible.");
            return;
        }

        if (hint) {
            return; // Hint already shown for this entity
        }

        statistics.incrementHints();
        
        const firstLetter = gameState.currentEntity.name.charAt(0).toUpperCase();
        
        // Get hint message from GameManager
        const hintMessage = gameManager.getFeedbackMessage(
            modeKey,
            'hint',
            isMultiplayer,
            { firstLetter }
        );
        
        setHint(hintMessage || `Indice : La première lettre est "${firstLetter}"`);
        setFeedbackMessage('');
    };

    // Handle keyboard input
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    };

    // Reset all input-related state
    const resetInputState = () => {
        setGuessInput('');
        setFeedbackMessage('');
        setHint('');
        setIsShaking(false);
    };

    return {
        // Input state
        guessInput,
        setGuessInput,
        feedbackMessage,
        hint,
        isShaking,
        
        // Actions
        handleGuess,
        handleSkip,
        handleHint,
        handleKeyPress,
        resetInputState
    };
}; 