// src/hooks/useTimer.js
// Custom React hook for managing countdown timer functionality
// Provides time tracking, automatic stopping, and time formatting utilities
import { useState, useEffect, useCallback, useRef } from 'react';

// Timer hook - manages countdown from initial time to zero
// Parameters:
// - initialTime: starting time in seconds
// - gameEnded: external flag to stop the timer
export const useTimer = (initialTime, gameEnded) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const intervalRef = useRef(null);

    // Simple timer effect - no dependency loops
    useEffect(() => {
        // Clear any existing timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Don't start timer if game ended
        if (gameEnded) {
            return;
        }

        // Start new timer
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [gameEnded]); // Only depend on gameEnded

    // Stop timer when time reaches 0
    useEffect(() => {
        if (timeLeft <= 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [timeLeft]);

    // Format time function
    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, []);

    // Set time function
    const setTimeLeftStable = useCallback((value) => {
        setTimeLeft(value);
    }, []);

    return { timeLeft, setTimeLeft: setTimeLeftStable, formatTime };
};
