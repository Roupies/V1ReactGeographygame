// src/hooks/useGameLogic.js
import { useState, useEffect } from 'react';
import { EUROPEAN_COUNTRIES, normalizeString } from '../data/countries';
import { useTimer } from './useTimer';

const GAME_TIME_SECONDS = 180; // Durée totale du jeu en secondes (3 minutes)
const HINT_PENALTY_SECONDS = 5; // Pénalité pour l'utilisation d'un indice

// Algorithme de Fisher-Yates pour mélanger un tableau
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Le hook accepte maintenant des paramètres pour la liste d'entités et les fonctions de validation
export const useGameLogic = (
    entities = EUROPEAN_COUNTRIES,
    getName = entity => entity.name,
    getAltNames = entity => entity.altNames || []
) => {
    const [countriesToGuess, setCountriesToGuess] = useState([]); // pile ordonnée
    const [guessedCountries, setGuessedCountries] = useState([]); 
    const [feedbackMessage, setFeedbackMessage] = useState(''); 
    const [guessInput, setGuessInput] = useState(''); 
    const [gameEnded, setGameEnded] = useState(false); 
    const [hint, setHint] = useState(''); 

    const totalCountries = entities.length;
    const { timeLeft, setTimeLeft, formatTime } = useTimer(GAME_TIME_SECONDS, gameEnded);

    // Initialisation ou reset du jeu
    const resetGame = () => {
        const shuffled = shuffleArray(entities);
        setCountriesToGuess(shuffled);
        setGuessedCountries([]);
        setTimeLeft(GAME_TIME_SECONDS);
        setGuessInput('');
        setFeedbackMessage('');
        setHint('');
        setGameEnded(false);
    };

    // Gestion de la fin du temps
    useEffect(() => {
        if (timeLeft === 0 && !gameEnded) { 
            setGameEnded(true);
            setFeedbackMessage(`Temps écoulé ! Vous avez deviné ${guessedCountries.length} entités sur ${totalCountries}.`);
        }
    }, [timeLeft, gameEnded, guessedCountries.length, totalCountries]); 

    // Gestion de la fin de la pile
    useEffect(() => {
        if (countriesToGuess.length === 0 && !gameEnded) {
            setGameEnded(true);
            setFeedbackMessage(`Félicitations ! Vous avez deviné toutes les ${totalCountries} entités !`);
        }
    }, [countriesToGuess, gameEnded, totalCountries]);

    // L'entité courante est toujours la première de la pile
    const currentCountry = countriesToGuess[0] || null;

    const handleGuess = () => {
        if (gameEnded) {
            setFeedbackMessage("Le jeu est terminé.");
            return;
        }
        if (!guessInput.trim()) {
            setFeedbackMessage("Veuillez entrer une réponse.");
            return;
        }

        const normalizedGuess = normalizeString(guessInput);
        const acceptedNames = [
            normalizeString(getName(currentCountry)),
            ...getAltNames(currentCountry).map(name => normalizeString(name))
        ];

        if (acceptedNames.includes(normalizedGuess)) {
            setFeedbackMessage(`Bonne réponse ! C'était ${getName(currentCountry)}.`);
            setGuessedCountries([...guessedCountries, currentCountry]);
            setGuessInput('');
            setHint('');
            // Retirer l'entité courante de la pile
            setCountriesToGuess(prev => prev.slice(1));
        } else {
            setFeedbackMessage(`Faux. Ce n'est pas ${guessInput.trim()}.`);
        }
    };

    const handleSkip = () => {
        if (gameEnded || !currentCountry) {
            setFeedbackMessage("Le jeu est terminé ou il n'y a pas d'entité à passer.");
            return;
        }
        setFeedbackMessage("");
        setGuessInput('');
        setHint('');
        // Déplacer l'entité courante à la fin de la pile
        setCountriesToGuess(prev => {
            if (prev.length <= 1) return prev; // rien à faire si une seule entité
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    };

    const handleHint = () => {
        if (gameEnded || !currentCountry) {
            setFeedbackMessage("Le jeu est terminé ou il n'y a pas d'entité pour un indice.");
            return;
        }

        if (hint) { 
            setFeedbackMessage("Un indice a déjà été donné pour cette entité.");
            return;
        }

        setTimeLeft(prevTime => Math.max(0, prevTime - HINT_PENALTY_SECONDS));
        const firstLetter = getName(currentCountry).charAt(0).toUpperCase();
        setHint(`Indice : La première lettre est "${firstLetter}"`);
        setFeedbackMessage(''); 
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    };

    return {
        currentCountry,
        guessedCountries,
        guessInput,
        setGuessInput,
        feedbackMessage,
        handleGuess,
        handleKeyPress,
        handleSkip, 
        handleHint, 
        hint, 
        timeLeft,
        formatTime,
        gameEnded,
        resetGame,
        totalCountries,
        gameTimeSeconds: GAME_TIME_SECONDS,
    };
};
