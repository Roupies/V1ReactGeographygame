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
    gameConfig
}) => {
    // Don't render if game ended or no current entity
    if (gameEnded || !currentCountry) {
        return null;
    }

    const getPlaceholder = () => {
        switch(gameConfig?.label) {
            case "Pays d'Europe":
                return "Entrez le nom du pays en surbrillance";
            case "Régions de France métropolitaine":
                return "Entrez le nom de la région en surbrillance";
            case "Toutes les régions françaises":
                return "Entrez le nom de la région en surbrillance";
            case "Toutes les régions (carte unique)":
                return "Entrez le nom de la région en surbrillance";
            default:
                return "Entrez le nom de la zone en surbrillance";
        }
    };

    return (
        <div className="modern-game-controls">
            {/* Modern input bar at bottom like in screenshot */}
            <div 
                className={`input-bar ${isShaking ? 'shake' : ''}`}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    backgroundColor: '#fff',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e0e0e0',
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
                        color: '#333',
                        backgroundColor: 'transparent'
                    }}
                />
                
                <button 
                    onClick={handleGuess} 
                    disabled={!currentCountry || !guessInput.trim()}
                    style={{
                        backgroundColor: '#007bff',
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

            {/* Bottom action buttons like in screenshot */}
            <div className="bottom-actions" style={{
                position: 'fixed',
                bottom: '100px',
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
                        backgroundColor: '#ffc107',
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
                
                <button 
                    onClick={handleSkip}
                    disabled={!currentCountry}
                    style={{
                        backgroundColor: '#6c757d',
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