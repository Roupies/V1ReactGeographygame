// src/hooks/useUnifiedTimer.js
// Hook timer unifié qui utilise la configuration GameManager
// Gère à la fois les timers locaux (solo) et serveur (multiplayer synchronisé)
import { useState, useEffect, useCallback, useRef } from 'react';
import gameManager from '../data/gameModes';

/**
 * Hook timer unifié basé sur la configuration GameManager
 * @param {string} modeKey - Clé du mode de jeu
 * @param {boolean} isMultiplayer - Mode multiplayer
 * @param {boolean} gameEnded - Jeu terminé
 * @param {number} serverTimeLeft - Temps restant du serveur (si synchronisé)
 * @returns {Object} Interface timer unifiée
 */
export const useGameTimer = (modeKey, isMultiplayer, gameEnded, serverTimeLeft = null) => {
    // Récupérer la configuration timer depuis GameManager
    const timerConfig = gameManager.getTimerConfig(modeKey, isMultiplayer);
    
    // ✅ CORRECTION : État du timer local avec instance unique par composant
    const [localTimeLeft, setLocalTimeLeft] = useState(() => timerConfig.seconds);
    const [timerStarted, setTimerStarted] = useState(false);
    const intervalRef = useRef(null);
    
    // Déterminer si on utilise le timer serveur ou local
    const useServerTimer = isMultiplayer && timerConfig.timerSyncServer && serverTimeLeft !== null;
    const effectiveTimeLeft = useServerTimer ? serverTimeLeft : localTimeLeft;
    
    // Gestion du timer local
    useEffect(() => {
        // Si on utilise le timer serveur, pas besoin du timer local
        if (useServerTimer) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setTimerStarted(false);
            return;
        }
        
        // Configuration timer local
        if (!timerConfig.timerDisplay || !timerConfig.timerAutoStart || gameEnded) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setTimerStarted(false);
            return;
        }
        
        // ✅ CORRECTION : Vérification supplémentaire - ne pas démarrer si pas d'entités
        if (!modeKey) {
            return;
        }
        
        // ✅ CORRECTION : Démarrer le timer automatiquement si toutes les conditions sont remplies
        if (!timerStarted && !intervalRef.current) {
            setTimerStarted(true);
            
            // Démarrer le timer local
            intervalRef.current = setInterval(() => {
                setLocalTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setTimerStarted(false);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
        
        // Cleanup sur démontage
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setTimerStarted(false);
            }
        };
    }, [useServerTimer, timerConfig.timerDisplay, timerConfig.timerAutoStart, gameEnded, modeKey]);
    
    // Synchroniser le timer local avec le serveur si nécessaire
    useEffect(() => {
        if (useServerTimer) {
            setLocalTimeLeft(serverTimeLeft);
        }
    }, [useServerTimer, serverTimeLeft]);
    
    // Arrêter le timer quand il atteint 0
    useEffect(() => {
        if (effectiveTimeLeft <= 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [effectiveTimeLeft]);
    
    // Fonction de formatage du temps
    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, []);
    
    // Fonction de démarrage manuel du timer
    const startTimer = useCallback(() => {
        if (!useServerTimer && !timerStarted && !intervalRef.current && timerConfig.timerDisplay) {
            setTimerStarted(true);
            
            intervalRef.current = setInterval(() => {
                setLocalTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setTimerStarted(false);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
    }, [useServerTimer, timerStarted, timerConfig.timerDisplay, modeKey]);
    
    // Fonction de reset du timer
    const resetTimer = useCallback(() => {
        setLocalTimeLeft(timerConfig.seconds);
        setTimerStarted(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [timerConfig.seconds]);
    
    // Fonction de set manual du temps
    const setTimeLeft = useCallback((value) => {
        if (!useServerTimer) {
            setLocalTimeLeft(value);
        }
        // Si timer serveur, ne pas permettre de set localement
    }, [useServerTimer]);
    
    // Configuration et métadonnées
    const timerInfo = {
        isDisplayed: timerConfig.timerDisplay,
        isAutoStart: timerConfig.timerAutoStart,
        isSyncedWithServer: useServerTimer,
        type: timerConfig.type,
        initialSeconds: timerConfig.seconds,
        modeKey,
        isMultiplayer
    };
    
    return {
        // État du timer
        timeLeft: effectiveTimeLeft,
        isRunning: effectiveTimeLeft > 0 && !gameEnded && timerConfig.timerAutoStart,
        isExpired: effectiveTimeLeft <= 0,
        
        // Fonctions de contrôle
        startTimer, // ✅ NOUVEAU : Fonction de démarrage manuel
        setTimeLeft,
        resetTimer,
        formatTime,
        
        // Informations de configuration
        config: timerConfig,
        info: timerInfo,
        
        // Pour compatibilité avec l'ancien useTimer
        gameTimeSeconds: timerConfig.seconds
    };
}; 