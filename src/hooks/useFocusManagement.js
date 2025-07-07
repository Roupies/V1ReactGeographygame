// Specialized hook for input focus management
// Follows Single Responsibility Principle - only handles focus logic
import { useRef, useEffect } from 'react';

export const useFocusManagement = (gameStarted, gameEnded) => {
    const inputRef = useRef(null);
    const mobileInputRef = useRef(null);

    // Detect if device is mobile/tablet
    const isMobile = () => {
        return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent) || 
               window.innerWidth < 1024;
    };

    // Auto-focus input when game starts (desktop only for better UX)
    useEffect(() => {
        if (!isMobile() && gameStarted && inputRef.current && !gameEnded) {
            // Wait for input to be mounted in DOM
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 100);
        }
    }, [gameStarted, gameEnded]);

    // Focus management after actions
    const focusInput = () => {
        if (gameEnded) return;
        
        if (window.innerWidth >= 1024 && inputRef.current) {
            inputRef.current.focus();
        } else if (window.innerWidth < 1024 && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    };

    // Enhanced action handlers that maintain focus
    const withFocusManagement = (actionHandler) => {
        return (...args) => {
            actionHandler(...args);
            focusInput();
        };
    };

    return {
        inputRef,
        mobileInputRef,
        focusInput,
        withFocusManagement
    };
}; 