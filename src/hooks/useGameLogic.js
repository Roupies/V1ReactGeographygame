// src/hooks/useGameLogic.js
import { useState, useEffect } from 'react';
import { EUROPEAN_COUNTRIES, normalizeString } from '../data/countries';
import { useTimer } from './useTimer';

const GAME_TIME_SECONDS = 180; // Durée totale du jeu en secondes (3 minutes)
const HINT_PENALTY_SECONDS = 5; // Pénalité pour l'utilisation d'un indice

export const useGameLogic = () => {
    const [currentCountry, setCurrentCountry] = useState(null); 
    const [guessedCountries, setGuessedCountries] = useState([]); 
    const [feedbackMessage, setFeedbackMessage] = useState(''); 
    const [guessInput, setGuessInput] = useState(''); 
    const [gameEnded, setGameEnded] = useState(false); 
    const [hint, setHint] = useState(''); 

    const totalCountries = EUROPEAN_COUNTRIES.length;

    const { timeLeft, setTimeLeft, formatTime } = useTimer(GAME_TIME_SECONDS, gameEnded);

    const selectNewCountry = () => {
        const availableCountries = EUROPEAN_COUNTRIES.filter(
            country => !guessedCountries.some(gc => gc.isoCode === country.isoCode)
        );

        if (availableCountries.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCountries.length);
            setCurrentCountry(availableCountries[randomIndex]);
            setFeedbackMessage(''); 
            setHint(''); 
        } else {
            setCurrentCountry(null); 
            setFeedbackMessage(`Félicitations ! Vous avez deviné tous les ${totalCountries} pays !`);
            setGameEnded(true); 
        }
    };

    useEffect(() => {
        if (timeLeft === 0 && !gameEnded) { 
            setGameEnded(true);
            setCurrentCountry(null); 
            setFeedbackMessage(`Temps écoulé ! Vous avez deviné ${guessedCountries.length} pays sur ${totalCountries}.`);
        }
    }, [timeLeft, gameEnded, guessedCountries.length, totalCountries]); 

    useEffect(() => {
        if (!currentCountry && !gameEnded && guessedCountries.length < totalCountries) {
            selectNewCountry();
        }
    }, [currentCountry, gameEnded, guessedCountries.length, totalCountries]); 

    const handleGuess = () => {
        if (gameEnded || !currentCountry || !guessInput.trim()) { 
            setFeedbackMessage("Le jeu est terminé ou le pays n'est pas sélectionné.");
            return;
        }

        const normalizedGuess = normalizeString(guessInput);
        
        const acceptedNames = [
            normalizeString(currentCountry.name),
            ...(currentCountry.altNames || []).map(name => normalizeString(name))
        ];

        if (acceptedNames.includes(normalizedGuess)) {
            setFeedbackMessage(`Bonne réponse ! C'était ${currentCountry.name}.`);
            setGuessedCountries([...guessedCountries, currentCountry]); 
            setGuessInput(''); 
            setHint(''); 
            setTimeout(() => {
                selectNewCountry();
            }, 500); 
        } else {
            setFeedbackMessage(`Faux. Ce n'est pas ${guessInput.trim()}.`);
        }
    };

    const handleSkip = () => {
        if (gameEnded || !currentCountry) {
            setFeedbackMessage("Le jeu est terminé ou il n'y a pas de pays à passer.");
            return;
        }
        setFeedbackMessage(`Vous avez passé le ${currentCountry.name}.`);
        setGuessInput(''); 
        setHint(''); 
        selectNewCountry(); 
    };

    const handleHint = () => {
        if (gameEnded || !currentCountry) {
            setFeedbackMessage("Le jeu est terminé ou il n'y a pas de pays pour un indice.");
            return;
        }

        if (hint) { 
            setFeedbackMessage("Un indice a déjà été donné pour ce pays.");
            return;
        }

        setTimeLeft(prevTime => Math.max(0, prevTime - HINT_PENALTY_SECONDS));

        const firstLetter = currentCountry.name.charAt(0).toUpperCase();
        setHint(`Indice : La première lettre est "${firstLetter}"`);
        setFeedbackMessage(''); 
    };

    const resetGame = () => {
        setGameEnded(false);
        setGuessedCountries([]);
        setTimeLeft(GAME_TIME_SECONDS);
        setGuessInput('');
        setFeedbackMessage('');
        setHint(''); 
        setCurrentCountry(null); 
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
