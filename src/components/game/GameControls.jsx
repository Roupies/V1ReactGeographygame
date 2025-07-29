// Modern game controls component inspired by the screenshot design
import React from 'react';

const GameControls = ({
    // Game state
    gameEnded,
    currentCountry,
    
    // Input state
    guessInput,
    setGuessInput,
    feedbackMessage,
    hint,
    isShaking,
    
    // Actions (with focus management already applied)
    handleGuess,
    handleSkip,
    handleHint,
    handleKeyPress,
    
    // Focus management
    inputRef,
    mobileInputRef,
    
    // Configuration
    selectedMode,
    gameConfig,
    theme,
    gameManager // Added gameManager prop
}) => {
    // Don't render if game ended or no current entity
    if (gameEnded || !currentCountry) {
        return null;
    }

    const getPlaceholder = () => {
        // Use custom placeholder from GameManager if available
        const uiCustomization = gameManager?.getUICustomization?.(selectedMode, false);
        if (uiCustomization?.customPlaceholder) {
            return uiCustomization.customPlaceholder;
        }
        
        // Use GameManager's unitLabel for automatic placeholder generation
        const unitLabel = gameConfig?.unitLabel || 'entité';
        // Special case for "région" to use "de la" instead of "de l'"
        if (unitLabel === 'région') {
            return `Entrez le nom de la ${unitLabel} en surbrillance`;
        }
        // Check for French vowels including accented ones
        const frenchVowels = /^[aeiouàâäéèêëïîôöùûüÿ]/i;
        return `Entrez le nom ${frenchVowels.test(unitLabel) ? 'de l\'' : 'du '}${unitLabel} en surbrillance`;
    };

    return (
        <div className="modern-game-controls">
            {/* Modern input bar at bottom like in screenshot */}
            <div 
                className={`input-bar ${isShaking ? 'shake' : ''}`}
                style={{
                    position: 'fixed',
                    bottom: '80px', // Remonté pour laisser place aux boutons en dessous
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    backgroundColor: theme?.colors?.inputBg || '#fff',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: `1px solid ${theme?.colors?.inputBorder || '#e0e0e0'}`,
                    minWidth: '400px',
                    maxWidth: '600px',
                    width: '80%',
                    zIndex: 1001 // Au-dessus de la carte
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={getPlaceholder()}
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!currentCountry}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        padding: '8px 0',
                        color: theme?.colors?.inputText || '#333',
                        backgroundColor: 'transparent'
                    }}
                />
                
                <button 
                    onClick={handleGuess} 
                    disabled={!currentCountry || !guessInput.trim()}
                    style={{
                        backgroundColor: theme?.colors?.buttonPrimary || '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '18px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: (!currentCountry || !guessInput.trim()) ? 0.5 : 1
                    }}
                >
                    Valider
                </button>
            </div>

            {/* Bottom action buttons like in screenshot - now below input */}
            <div className="bottom-actions" style={{
                position: 'fixed',
                bottom: '20px', // En dessous de l'input maintenant
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '15px',
                zIndex: 1001 // Au-dessus de la carte
            }}>
                <button 
                    onClick={handleHint}
                    disabled={!currentCountry}
                    style={{
                        backgroundColor: theme?.colors?.buttonHint || '#ffc107',
                        color: '#333',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Indice
                </button>
                
                {/* Skip button - only show if enabled in game config */}
                {gameConfig?.showSkip !== false && (
                    <button 
                        onClick={handleSkip}
                        disabled={!currentCountry}
                        style={{
                            backgroundColor: theme?.colors?.buttonSkip || '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Passer
                    </button>
                )}
            </div>

            {/* Mobile input for responsive design */}
            <input
                ref={mobileInputRef}
                type="text"
                style={{ display: 'none' }} // Hidden, only for focus management
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!currentCountry}
            />
        </div>
    );
};

export default GameControls; 