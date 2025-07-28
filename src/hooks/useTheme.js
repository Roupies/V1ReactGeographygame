// Hook for managing theme colors
export const useTheme = (gameMode = null) => {
    const theme = {
        colors: {
            // Light mode (clean bright design)
            background: '#c4c4c4', // Mer/océans en gris
            timer: '#1E3241',
            score: '#1E3241', 
            // Score progression colors
            progressBg: '#D9E2DA',
            progressFill: '#089DC0',
            starsFilled: '#FFD568',
            starsEmpty: '#A9BDAD',
            trophyFilled: '#FFD568',
            trophyStroke: '#D69E2E',
            trophyEmpty: '#A9BDAD',
            starBgEmpty: '#D9E2DA',
            starBgFilled: '#FFFFFF',
            // Map colors
            mapBackground: '#f5f5f5',
            mapBackgroundImage: 'url(/src/assets/background.png)',
            // Couleur des régions/pays à deviner selon le mode
            countryDefault: gameMode === 'franceComplete' ? '#4F4F4F' : '#F8FAF8', // #4F4F4F pour les régions de France, #F8FAF8 pour les pays d'Europe
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