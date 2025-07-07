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
        
        // Europe mode: increase scale and adjust rotation for mobile
        if (selectedMode === 'europe') {
            return {
                ...baseConfig,
                scale: isMobileOrTablet ? 900 : baseConfig.scale,
                rotate: isMobileOrTablet ? 
                    [baseConfig.rotate[0], -50, baseConfig.rotate[2]] : 
                    baseConfig.rotate
            };
        }
        
        // France regions mode: increase scale significantly for mobile
        if (selectedMode === 'franceRegions') {
            return {
                ...baseConfig,
                scale: isMobileOrTablet ? 2400 : baseConfig.scale,
                rotate: isMobileOrTablet ? 
                    [baseConfig.rotate[0], -46, baseConfig.rotate[2]] : 
                    baseConfig.rotate
            };
        }

        // Default: return base configuration
        return baseConfig;
    }, [gameConfig?.projectionConfig, selectedMode, windowWidth]);

    return projectionConfig;
}; 