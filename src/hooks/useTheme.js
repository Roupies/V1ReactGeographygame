// Hook for managing theme colors
export const useTheme = () => {
    const theme = {
        colors: {
            // Light mode (clean bright design)
            background: '#c4c4c4', // Mer/océans en gris
            timer: '#1E3241',
            score: '#1E3241', 
            progressBg: '#e5e7eb',
            progressFill: 'linear-gradient(90deg, #10b981, #059669, #047857)',
            progressShadow: 'rgba(16, 185, 129, 0.4)',
            starsFilled: '#10b981',
            starsEmpty: '#d1d5db',
            trophyFilled: '#10b981',
            trophyStroke: '#059669',
            trophyEmpty: '#d1d5db',
            // Map colors
            mapBackground: '#f5f5f5',
            mapBackgroundImage: 'url(/src/assets/background.png)',
            countryDefault: '#F8FAF8', // Pays d'Europe
            countryNonEuropean: '#E5EBE6', // Autres pays en gris clair
            countryGuessed: '#B3D9E6',
            countryCurrent: '#FF585E',
            countryBorder: '#CDD2D5', // Bordure gris clair pour les pays européens
            // Interface colors
            inputBg: '#f9fafb',
            inputText: '#1f2937',
            inputBorder: '#d1d5db',
            buttonPrimary: '#10b981',
            buttonHint: '#f59e0b',
            buttonSkip: '#6b7280'
        }
    };

    return {
        theme
    };
}; 