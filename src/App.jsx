// src/App.jsx
import React from 'react';
import MapChart from './components/game/MapChart/MapChart';
import { useGameLogic } from './hooks/useGameLogic'; 
import './App.css'; 

function App() {
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
    } = useGameLogic();

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

                {/* Affiche les contrôles de jeu actifs (input + Deviner + Passer + Indice) si le jeu n'est pas terminé et qu'un pays est sélectionné */}
                {!gameEnded && currentCountry && (
                    <div className="game-buttons-row"> 
                        <input
                            type="text"
                            placeholder="Entrez le nom du pays..."
                            value={guessInput}
                            onChange={(e) => setGuessInput(e.target.value)}
                            onKeyPress={handleKeyPress} 
                            disabled={!currentCountry} 
                        />
                        <button onClick={handleGuess} disabled={!currentCountry}>Deviner</button> 
                        <button 
                            onClick={handleSkip} 
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
                            onClick={handleHint} 
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
                            Vous avez deviné <span style={{color: '#A8D9A7', fontWeight: 'bold'}}>{guessedCountries.length}</span> pays sur <span style={{color: '#FFF', fontWeight: 'bold'}}>{totalCountries}</span>.
                        </p>
                        <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
                            Temps écoulé : <span style={{color: '#FF4D4D', fontWeight: 'bold'}}>{formatTime(gameTimeSeconds - timeLeft)}</span>
                        </p>
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
                            }}
                        >
                            Rejouer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
