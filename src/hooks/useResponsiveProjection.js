// Specialized hook for responsive map projection configuration
// Follows Single Responsibility Principle - only handles projection logic
import { useState, useEffect, useMemo } from 'react';

export const useResponsiveProjection = (selectedMode, gameConfig) => {
    // Track window width with state to trigger re-calculations only when needed
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Listen for resize events
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate responsive projection configuration only when needed
    const projectionConfig = useMemo(() => {
        if (!gameConfig?.projectionConfig) {
            return null;
        }

        const isMobileOrTablet = windowWidth < 1024;
        const baseConfig = gameConfig.projectionConfig;
        
        // Use responsive settings from gameConfig if available
        const responsiveConfig = gameConfig.responsiveProjection;
        
        if (responsiveConfig && isMobileOrTablet) {
            return {
                ...baseConfig,
                scale: responsiveConfig.mobileScale || baseConfig.scale,
                rotate: responsiveConfig.mobileRotate || baseConfig.rotate
            };
        }

        // Default: return base configuration
        return baseConfig;
    }, [gameConfig?.projectionConfig, gameConfig?.responsiveProjection, windowWidth]);

    return projectionConfig;
}; 