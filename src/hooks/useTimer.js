// src/hooks/useTimer.js
import { useState, useEffect } from 'react';

export const useTimer = (initialTime, gameEnded) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    // Effet pour gérer le minuteur
    useEffect(() => {
        // Arrête le minuteur si le jeu est terminé (état global 'gameEnded') ou si le temps est écoulé
        if (gameEnded || timeLeft === 0) {
            return; 
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        // Fonction de nettoyage pour arrêter le minuteur quand le composant est démonté ou l'effet est relancé
        return () => clearInterval(timer); 
    }, [timeLeft, gameEnded]); // Le minuteur se relance ou s'arrête si le temps ou l'état du jeu change

    // Fonction pour formater le temps en MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return { timeLeft, setTimeLeft, formatTime };
};
