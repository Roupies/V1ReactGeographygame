// Specialized component for game controls (input, buttons, feedback)
// Follows Single Responsibility Principle - only handles control UI
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

    return (
        <div className="game-controls">
            {/* Feedback messages (correct/incorrect answers, hints) */}
            {feedbackMessage && <p>{feedbackMessage}</p>}
            
            {/* Hint display - shown when user requests a hint */}
            {hint && (
                <p style={{
                    marginTop: '10px', 
                    color: '#4CAF50',   // Green color for hints
                    fontStyle: 'italic',
                    fontSize: '1.1em'
                }}>{hint}</p>
            )}

            {/* Desktop Layout - horizontal row with input and buttons */}
            <div className="game-buttons-row"> 
                {/* Main input field for user guesses */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      selectedMode === 'franceRegions'
                        ? 'Entrez le nom de la région...'        // French regions placeholder
                        : `Entrez le nom du ${gameConfig.unitLabel}...`  // Generic placeholder
                    }
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyPress={handleKeyPress}  // Handle Enter key
                    disabled={!currentCountry}   // Disable when no current entity
                />
                
                {/* Skip button - moves current entity to end of queue */}
                <button 
                    onClick={handleSkip}
                    style={{
                        backgroundColor: '#FFC107',  // Bootstrap warning color (yellow)
                        color: '#333',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.1s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        fontSize: '0.9em'
                    }}
                    disabled={!currentCountry} 
                >
                    Passer
                </button>
                
                {/* Hint button - shows first letter with time penalty */}
                <button 
                    onClick={handleHint}
                    style={{
                        backgroundColor: '#17A2B8',  // Bootstrap info color (blue)
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.1s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        fontSize: '0.9em'
                    }}
                    disabled={!currentCountry} 
                >
                    ?
                </button>
                
                {/* Submit button - processes the user's guess */}
                <button onClick={handleGuess} disabled={!currentCountry}>Valider</button> 
            </div>

            {/* Mobile Layout - input above, buttons in horizontal row */}
            <div className="mobile-input-container">
                <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder={
                      selectedMode === 'franceRegions'
                        ? 'Entrez le nom de la région...'
                        : `Entrez le nom du ${gameConfig.unitLabel}...`
                    }
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyPress={handleKeyPress} 
                    disabled={!currentCountry} 
                />
            </div>
            
            {/* Mobile buttons container - three buttons in a row */}
            <div className="mobile-buttons-container">
                <button 
                    onClick={handleSkip}
                    style={{
                        backgroundColor: '#FFC107', 
                        color: '#333',
                    }}
                    disabled={!currentCountry} 
                >
                    Passer
                </button>
                <button 
                    onClick={handleHint}
                    style={{
                        backgroundColor: '#17A2B8', 
                        color: 'white',
                    }}
                    disabled={!currentCountry} 
                >
                    ?
                </button>
                <button onClick={handleGuess} disabled={!currentCountry}>Valider</button> 
            </div>
        </div>
    );
};

export default GameControls; 