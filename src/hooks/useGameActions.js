// Specialized hook for game actions and user interactions
// Follows Interface Segregation Principle - only handles actions
// Follows Dependency Inversion Principle - depends on abstractions
import { useState } from 'react';
import { normalizeString } from '../data/countries';



export const useGameActions = (
    gameState,
    statistics,
    timer,
    getName,
    getAltNames
) => {
    const [guessInput, setGuessInput] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [hint, setHint] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    // Process user guess
    const handleGuess = () => {
        if (gameState.gameEnded || !guessInput.trim()) {
            setFeedbackMessage("Veuillez entrer une réponse.");
            return;
        }

        if (!gameState.currentCountry) {
            setFeedbackMessage("Aucune entité à deviner.");
            return;
        }

        statistics.incrementGuesses();

        const normalizedGuess = normalizeString(guessInput);
        const acceptedNames = [
            normalizeString(getName(gameState.currentCountry)),
            ...getAltNames(gameState.currentCountry).map(name => normalizeString(name))
        ];

        if (acceptedNames.includes(normalizedGuess)) {
            setFeedbackMessage(`Bonne réponse ! C'était ${getName(gameState.currentCountry)}.`);
            gameState.markEntityAsGuessed(gameState.currentCountry);
            setGuessInput('');
            setHint('');
            setIsShaking(false); // Arrêter la secousse si bonne réponse
        } else {
            setFeedbackMessage(`Faux. Ce n'est pas ${guessInput.trim()}.`);
            setGuessInput(''); // Vider l'input même pour les mauvaises réponses
            
            // Déclencher l'animation de secousse
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500); // Arrêter la secousse après 500ms
        }
    };

    // Skip current entity
    const handleSkip = () => {
        if (gameState.gameEnded || !gameState.currentCountry) {
            setFeedbackMessage("Impossible de passer : jeu terminé ou aucune entité disponible.");
            return;
        }
        
        statistics.incrementSkips();
        gameState.skipCurrentEntity();
        setFeedbackMessage("");
        setGuessInput('');
        setHint('');
        setIsShaking(false); // Arrêter la secousse quand on skip
    };

    // Show hint with time penalty
    const handleHint = () => {
        if (gameState.gameEnded || !gameState.currentCountry) {
            setFeedbackMessage("Impossible d'afficher l'indice : jeu terminé ou aucune entité disponible.");
            return;
        }

        if (hint) {
            return; // Hint already shown for this entity
        }

        statistics.incrementHints();
        
        const firstLetter = getName(gameState.currentCountry).charAt(0).toUpperCase();
        setHint(`Indice : La première lettre est "${firstLetter}"`);
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