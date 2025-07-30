// Hook pour détecter la qualité de connexion réseau
// Utile pour adapter le comportement selon la connexion mobile
import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
    const [networkInfo, setNetworkInfo] = useState({
        isOnline: navigator.onLine,
        isSlow: false,
        effectiveType: 'unknown',
        downlink: null,
        rtt: null
    });

    useEffect(() => {
        const updateNetworkInfo = () => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            setNetworkInfo({
                isOnline: navigator.onLine,
                isSlow: connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g',
                effectiveType: connection?.effectiveType || 'unknown',
                downlink: connection?.downlink || null,
                rtt: connection?.rtt || null
            });
        };

        // Événements de changement de réseau
        window.addEventListener('online', updateNetworkInfo);
        window.addEventListener('offline', updateNetworkInfo);
        
        // Événements de changement de connexion (si supporté)
        if (navigator.connection) {
            navigator.connection.addEventListener('change', updateNetworkInfo);
        }

        // Mise à jour initiale
        updateNetworkInfo();

        return () => {
            window.removeEventListener('online', updateNetworkInfo);
            window.removeEventListener('offline', updateNetworkInfo);
            if (navigator.connection) {
                navigator.connection.removeEventListener('change', updateNetworkInfo);
            }
        };
    }, []);

    return networkInfo;
}; 