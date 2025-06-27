// src/App.jsx
import React, { useRef, useState, useEffect } from 'react';
import MapChart from './components/game/MapChart/MapChart';
import { useGameLogic } from './hooks/useGameLogic'; 
import { GAME_MODES } from './data/gameModes';
import HomeScreen from './components/HomeScreen';
import './App.css'; 

function App() {
    const [selectedMode, setSelectedMode] = useState(null);
    const gameConfig = selectedMode ? GAME_MODES[selectedMode] : null;

    // Appelle TOUS les hooks, même si tu ne t'en sers pas tout de suite
    const {
        currentCountry,
        guessedCountries,
        guessInput,
        setGuessInput,
        feedbackMessage,
        handleGuess,
        handleKeyPress,
        handleSkip, 
        handleHint, 
        hint, 
        timeLeft,
        formatTime,
        gameEnded,
        resetGame,
        totalCountries,
        gameTimeSeconds, 
    } = useGameLogic(
        gameConfig?.entities,
        gameConfig?.getName,
        gameConfig?.getAltNames
    );

    const inputRef = useRef(null);

    // Reset automatique à chaque changement de mode
    useEffect(() => {
        if (selectedMode && resetGame) {
            resetGame();
        }
    }, [selectedMode]);

    const handleSkipWithFocus = () => {
        handleSkip();
        if (inputRef.current) inputRef.current.focus();
    };
    const handleHintWithFocus = () => {
        handleHint();
        if (inputRef.current) inputRef.current.focus();
    };
    const handleGuessWithFocus = () => {
        handleGuess();
        if (inputRef.current && !gameEnded) inputRef.current.focus();
    };

    // Fonction pour revenir à l'accueil (choix du mode)
    const goToHome = () => setSelectedMode(null);

    // Rendu conditionnel APRÈS les hooks
    if (!selectedMode) {
        return <HomeScreen onSelectMode={setSelectedMode} />;
    }

    return (
        <div className="App">
            <div className="game-header">
                <h1></h1> 
                <div className="score-display" style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    padding: '10px 15px', 
                    borderRadius: '15px', 
                    color: '#FFF', 
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    Score: {guessedCountries.length} / {totalCountries}
                </div>
                <div className="timer-display" style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    padding: '10px 15px', 
                    borderRadius: '15px', 
                    color: '#FFF', 
                    fontWeight: 'bold',
                    fontSize: '1.8em', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    minWidth: '100px', 
                    textAlign: 'center'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="map-container">
                <MapChart 
                    currentCountry={currentCountry} 
                    guessedCountries={guessedCountries} 
                    geoJsonPath={gameConfig.geoJson}
                    geoIdProperty={gameConfig.geoIdProperty}
                    projectionConfig={gameConfig.projectionConfig}
                />
            </div>

            <div className="game-controls">
                {/* Affiche le message de feedback */}
                {feedbackMessage && <p>{feedbackMessage}</p>}
                
                {/* Affiche l'indice si disponible */}
                {hint && (
                    <p style={{
                        marginTop: '10px', 
                        color: '#4CAF50', 
                        fontStyle: 'italic',
                        fontSize: '1.1em'
                    }}>{hint}</p>
                )}

                {/* Affiche les contrôles de jeu actifs (input + Deviner + Passer + Indice) si le jeu n'est pas terminé et qu'une entité est sélectionnée */}
                {!gameEnded && currentCountry && (
                    <div className="game-buttons-row"> 
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={`Entrez le nom du ${gameConfig.unitLabel}...`}
                            value={guessInput}
                            onChange={(e) => setGuessInput(e.target.value)}
                            onKeyPress={handleKeyPress} 
                            disabled={!currentCountry} 
                        />
                        <button onClick={handleGuessWithFocus} disabled={!currentCountry}>Deviner</button> 
                        <button 
                            onClick={handleSkipWithFocus}
                            style={{
                                backgroundColor: '#FFC107', 
                                color: '#333',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px 25px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, transform 0.1s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            }}
                            disabled={!currentCountry} 
                        >
                            Passer
                        </button>
                        <button 
                            onClick={handleHintWithFocus}
                            style={{
                                backgroundColor: '#17A2B8', 
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px 25px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, transform 0.1s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            }}
                            disabled={!currentCountry} 
                        >
                            Indice
                        </button>
                    </div>
                )}
            </div> {/* Fin .game-controls */}

            {/* Écran de fin de partie (Modale/Overlay) */}
            {gameEnded && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000000', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 20, 
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#282828', 
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                        maxWidth: '90%',
                        margin: '20px'
                    }}>
                        <h2 style={{ fontSize: '2.5em', color: '#FFD700', marginBottom: '20px' }}>
                            Jeu Terminé !
                        </h2>
                        <p style={{ fontSize: '1.5em', marginBottom: '15px' }}>
                            Vous avez deviné <span style={{color: '#A8D9A7', fontWeight: 'bold'}}>{guessedCountries.length}</span> {gameConfig.unitLabel} sur <span style={{color: '#FFF', fontWeight: 'bold'}}>{totalCountries}</span>.
                        </p>
                        <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
                            Temps écoulé : <span style={{color: '#FF4D4D', fontWeight: 'bold'}}>{formatTime(gameTimeSeconds - timeLeft)}</span>
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', marginTop: '20px' }}>
                            <button 
                                onClick={resetGame} 
                                style={{
                                    backgroundColor: '#007bff',
                                    borderRadius: '30px', 
                                    padding: '15px 40px', 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.3em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, transform 0.1s ease',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                    minWidth: '200px',
                                }}
                            >
                                Rejouer
                            </button>
                            <button
                                onClick={goToHome}
                                style={{
                                    backgroundColor: '#17A2B8',
                                    borderRadius: '30px',
                                    padding: '15px 40px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.3em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    minWidth: '200px',
                                    transition: 'background-color 0.3s ease, transform 0.1s ease',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                }}
                            >
                                Choisir un autre mode
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
