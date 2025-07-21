// Hint popup component that appears on the side like in screenshot
import React from 'react';

const HintPopup = ({ 
    hint, 
    currentCountry, 
    gameConfig,
    onClose,
    theme 
}) => {
    // Don't render if no hint
    if (!hint || !currentCountry) {
        return null;
    }

    // Generate different types of hints based on game mode
    const getHintText = () => {
        if (!currentCountry) return "";
        
        const name = currentCountry.name;
        const firstLetter = name.charAt(0).toUpperCase();
        
        switch(gameConfig?.label) {
            case "Pays d'Europe":
                // For countries, we could show capital or first letter
                if (currentCountry.capital) {
                    return `La capitale de ce pays est ${currentCountry.capital}.`;
                }
                return `Ce pays commence par la lettre "${firstLetter}".`;
                
            case "Régions de France métropolitaine":
            case "Toutes les régions françaises":
            case "Toutes les régions (carte unique)":
                return `Cette région commence par la lettre "${firstLetter}".`;
                
            default:
                return `Cette zone commence par la lettre "${firstLetter}".`;
        }
    };

    return (
        <div 
            className="hint-popup"
            style={{
                position: 'fixed',
                left: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: theme?.colors?.inputBg || '#fff',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                border: `1px solid ${theme?.colors?.inputBorder || '#e0e0e0'}`,
                maxWidth: '280px',
                zIndex: 1000,
                animation: 'slideInLeft 0.3s ease'
            }}
        >
            {/* Close button */}
            <button 
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    color: '#999',
                    cursor: 'pointer',
                    padding: '0',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ×
            </button>

            {/* Hint icon */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px'
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: theme?.colors?.buttonHint || '#ffc107',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    💡
                </div>
                <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: theme?.colors?.inputText || '#333'
                }}>
                    Indice
                </h4>
            </div>

            {/* Hint text */}
            <p style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.4',
                color: theme?.colors?.inputText || '#666'
            }}>
                {getHintText()}
            </p>
        </div>
    );
};

export default HintPopup; 