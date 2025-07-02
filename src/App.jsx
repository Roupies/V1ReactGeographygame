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
        totalGuesses,
        hintsUsed,
        skipsUsed,
        accuracy
    } = useGameLogic(
        gameConfig?.entities,
        gameConfig?.getName,
        gameConfig?.getAltNames
    );

    const inputRef = useRef(null);
    const mobileInputRef = useRef(null);

    // Reset automatique à chaque changement de mode
    useEffect(() => {
        if (selectedMode && resetGame) {
            resetGame();
        }
    }, [selectedMode]);

    // Focus automatique dans l'input à l'arrivée sur desktop uniquement (quand le jeu commence)
    useEffect(() => {
        // Détection mobile/tablette plus fiable
        const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent) || window.innerWidth < 1024;
        if (!isMobile && selectedMode && inputRef.current && !gameEnded) {
            // Attendre que l'input soit monté
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 100);
        }
    }, [selectedMode, gameEnded]);

    const handleSkipWithFocus = () => {
        handleSkip();
        if (window.innerWidth >= 1024 && inputRef.current) {
            inputRef.current.focus();
        } else if (window.innerWidth < 1024 && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    };
    const handleHintWithFocus = () => {
        handleHint();
        if (window.innerWidth >= 1024 && inputRef.current) {
            inputRef.current.focus();
        } else if (window.innerWidth < 1024 && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    };
    const handleGuessWithFocus = () => {
        handleGuess();
        if (window.innerWidth >= 1024 && inputRef.current && !gameEnded) {
            inputRef.current.focus();
        } else if (window.innerWidth < 1024 && mobileInputRef.current && !gameEnded) {
            mobileInputRef.current.focus();
        }
    };

    // Fonction pour revenir à l'accueil (choix du mode)
    const goToHome = () => setSelectedMode(null);

    // Rendu conditionnel APRÈS les hooks
    if (!selectedMode) {
        return <HomeScreen onSelectMode={setSelectedMode} />;
    }

    // --- Projection dynamique pour la responsivité (zoom Europe et France) ---
    let projectionConfig = gameConfig?.projectionConfig;
    if (projectionConfig) {
        const isMobileOrTablet = window.innerWidth < 1024;
        
        if (selectedMode === 'europe') {
            projectionConfig = {
                ...projectionConfig,
                scale: isMobileOrTablet ? 900 : projectionConfig.scale,
                rotate: isMobileOrTablet ? [projectionConfig.rotate[0], -50, projectionConfig.rotate[2]] : projectionConfig.rotate
            };
        } else if (selectedMode === 'franceRegions') {
            projectionConfig = {
                ...projectionConfig,
                scale: isMobileOrTablet ? 2400 : projectionConfig.scale,
                rotate: isMobileOrTablet ? [projectionConfig.rotate[0], -46, projectionConfig.rotate[2]] : projectionConfig.rotate
            };
        }
    }

    return (
        <div className="App">
            <div className="game-header">
                <h1></h1> 
                <div className="timer-display" style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '25%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: '#17A2B8', 
                    padding: '10px 15px', 
                    borderRadius: '15px', 
                    color: '#FFF', 
                    fontWeight: 'bold',
                    fontSize: '1.2em', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    minWidth: '100px', 
                    textAlign: 'center'
                }}>
                    {formatTime(timeLeft)}
                </div>
                <div className="score-display" style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '75%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: '#4CAF50', 
                    padding: '10px 15px', 
                    borderRadius: '15px', 
                    color: '#FFF', 
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    {window.innerWidth < 1024 
                        ? `${guessedCountries.length}/${totalCountries}` 
                        : `Score: ${guessedCountries.length} / ${totalCountries}`
                    }
                </div>
            </div>

            <div className="map-container">
                <MapChart 
                    currentCountry={currentCountry} 
                    guessedCountries={guessedCountries} 
                    geoJsonPath={gameConfig.geoJson}
                    geoIdProperty={gameConfig.geoIdProperty}
                    projectionConfig={projectionConfig}
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

                {/* Layout Desktop - ligne avec input + boutons */}
                {!gameEnded && currentCountry && (
                    <div className="game-buttons-row"> 
                        <input
                            ref={inputRef}
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
                        <button 
                            onClick={handleSkipWithFocus}
                            style={{
                                backgroundColor: '#FFC107', 
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
                        <button 
                            onClick={handleHintWithFocus}
                            style={{
                                backgroundColor: '#17A2B8', 
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
                        <button onClick={handleGuessWithFocus} disabled={!currentCountry}>Valider</button> 
                    </div>
                )}

                {/* Layout Mobile - input au-dessus, boutons en ligne */}
                {!gameEnded && currentCountry && (
                    <>
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
                        <div className="mobile-buttons-container">
                            <button 
                                onClick={handleSkipWithFocus}
                                style={{
                                    backgroundColor: '#FFC107', 
                                    color: '#333',
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
                                }}
                                disabled={!currentCountry} 
                            >
                                ?
                            </button>
                            <button onClick={handleGuessWithFocus} disabled={!currentCountry}>Valider</button> 
                        </div>
                    </>
                )}
            </div> {/* Fin .game-controls */}

            {/* Écran de fin de partie (Modale/Overlay) */}
            {gameEnded && (
                <div className="end-game-overlay" style={{
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
                    textAlign: 'center',
                    padding: window.innerWidth <= 768 ? '5px' : '20px',
                    boxSizing: 'border-box'
                }}>
                    <div className="end-game-modal" style={{
                        backgroundColor: '#282828', 
                        padding: window.innerWidth <= 480 ? '10px' : 
                                window.innerWidth <= 768 ? '15px' : '40px',
                        borderRadius: window.innerWidth <= 480 ? '15px' : '20px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                        maxWidth: window.innerWidth <= 480 ? 'calc(100vw - 10px)' : 
                                 window.innerWidth <= 768 ? 'calc(100vw - 20px)' : '90%',
                        width: window.innerWidth <= 480 ? 'calc(100vw - 10px)' : 
                               window.innerWidth <= 768 ? 'calc(100vw - 20px)' : '100%',
                        maxHeight: window.innerWidth <= 480 ? 'calc(100vh - 20px)' : 'calc(100vh - 40px)',
                        overflowY: 'auto',
                        margin: window.innerWidth <= 480 ? '5px' : '10px',
                        boxSizing: 'border-box'
                    }}>
                        <h2 className="end-game-title" style={{ 
                            fontSize: window.innerWidth <= 480 ? '1.4em' : 
                                     window.innerWidth <= 768 ? '1.6em' : '2.5em', 
                            color: '#FFD700', 
                            marginBottom: window.innerWidth <= 480 ? '10px' : 
                                         window.innerWidth <= 768 ? '12px' : '20px',
                            lineHeight: '1.2'
                        }}>
                            Jeu Terminé !
                        </h2>
                        <p style={{ 
                            fontSize: window.innerWidth <= 480 ? '1.1em' : 
                                     window.innerWidth <= 768 ? '1.3em' : '1.5em', 
                            marginBottom: '15px',
                            lineHeight: '1.4'
                        }}>
                            Vous avez deviné <span style={{color: '#A8D9A7', fontWeight: 'bold'}}>{guessedCountries.length}</span> {gameConfig.unitLabel} sur <span style={{color: '#FFF', fontWeight: 'bold'}}>{totalCountries}</span>.
                        </p>
                        <p style={{ 
                            fontSize: window.innerWidth <= 480 ? '1em' : 
                                     window.innerWidth <= 768 ? '1.1em' : '1.2em', 
                            marginBottom: window.innerWidth <= 480 ? '20px' : '30px' 
                        }}>
                            Temps écoulé : <span style={{color: '#FF4D4D', fontWeight: 'bold'}}>{formatTime(gameTimeSeconds - timeLeft)}</span>
                        </p>
                        
                        {/* Statistiques détaillées */}
                        <div className="end-game-stats-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: window.innerWidth <= 480 ? 'repeat(2, 1fr)' : 
                                               window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                            gap: window.innerWidth <= 480 ? '6px' : window.innerWidth <= 768 ? '8px' : '15px', 
                            marginBottom: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '15px' : '30px',
                            maxWidth: '100%'
                        }}>
                            <div className="end-game-stat-item" style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                padding: window.innerWidth <= 480 ? '4px 6px' : window.innerWidth <= 768 ? '6px 8px' : '10px 15px', 
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '1.1em' : window.innerWidth <= 768 ? '1.2em' : '1.5em', 
                                    fontWeight: 'bold', 
                                    color: '#4CAF50' 
                                }}>{accuracy}%</div>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '0.7em' : window.innerWidth <= 768 ? '0.8em' : '0.9em', 
                                    opacity: 0.8 
                                }}>Précision</div>
                            </div>
                            <div className="end-game-stat-item" style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                padding: window.innerWidth <= 480 ? '4px 6px' : window.innerWidth <= 768 ? '6px 8px' : '10px 15px', 
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '1.1em' : window.innerWidth <= 768 ? '1.2em' : '1.5em', 
                                    fontWeight: 'bold', 
                                    color: '#FFC107' 
                                }}>{totalGuesses}</div>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '0.7em' : window.innerWidth <= 768 ? '0.8em' : '0.9em', 
                                    opacity: 0.8 
                                }}>Tentatives</div>
                            </div>
                            <div className="end-game-stat-item" style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                padding: window.innerWidth <= 480 ? '4px 6px' : window.innerWidth <= 768 ? '6px 8px' : '10px 15px', 
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '1.1em' : window.innerWidth <= 768 ? '1.2em' : '1.5em', 
                                    fontWeight: 'bold', 
                                    color: '#17A2B8' 
                                }}>{hintsUsed}</div>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '0.7em' : window.innerWidth <= 768 ? '0.8em' : '0.9em', 
                                    opacity: 0.8 
                                }}>Indices</div>
                            </div>
                            <div className="end-game-stat-item" style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                padding: window.innerWidth <= 480 ? '4px 6px' : window.innerWidth <= 768 ? '6px 8px' : '10px 15px', 
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '1.1em' : window.innerWidth <= 768 ? '1.2em' : '1.5em', 
                                    fontWeight: 'bold', 
                                    color: '#FF6B6B' 
                                }}>{skipsUsed}</div>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 480 ? '0.7em' : window.innerWidth <= 768 ? '0.8em' : '0.9em', 
                                    opacity: 0.8 
                                }}>Passés</div>
                            </div>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: window.innerWidth <= 480 ? '12px' : '18px', 
                            marginTop: '20px' 
                        }}>
                            <button 
                                className="end-game-button"
                                onClick={resetGame} 
                                style={{
                                    backgroundColor: '#007bff',
                                    borderRadius: window.innerWidth <= 480 ? '20px' : '30px', 
                                    padding: window.innerWidth <= 480 ? '8px 15px' : 
                                            window.innerWidth <= 768 ? '10px 20px' : '15px 40px', 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: window.innerWidth <= 480 ? '0.9em' : 
                                             window.innerWidth <= 768 ? '1em' : '1.3em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, transform 0.1s ease',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                    width: window.innerWidth <= 480 ? 'calc(100% - 10px)' : 
                                           window.innerWidth <= 768 ? 'calc(100% - 20px)' : 'auto',
                                    maxWidth: window.innerWidth <= 480 ? 'calc(100% - 10px)' : 
                                             window.innerWidth <= 768 ? 'calc(100% - 20px)' : 'none',
                                    minWidth: window.innerWidth <= 480 ? 'auto' : '200px',
                                    margin: window.innerWidth <= 480 ? '0 5px' : 
                                           window.innerWidth <= 768 ? '0 10px' : '0',
                                    boxSizing: 'border-box'
                                }}
                            >
                                Rejouer
                            </button>
                            <button
                                className="end-game-button"
                                onClick={goToHome}
                                style={{
                                    backgroundColor: '#17A2B8',
                                    borderRadius: window.innerWidth <= 480 ? '20px' : '30px',
                                    padding: window.innerWidth <= 480 ? '8px 15px' : 
                                            window.innerWidth <= 768 ? '10px 20px' : '15px 40px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: window.innerWidth <= 480 ? '0.9em' : 
                                             window.innerWidth <= 768 ? '1em' : '1.3em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: window.innerWidth <= 480 ? 'calc(100% - 10px)' : 
                                           window.innerWidth <= 768 ? 'calc(100% - 20px)' : 'auto',
                                    maxWidth: window.innerWidth <= 480 ? 'calc(100% - 10px)' : 
                                             window.innerWidth <= 768 ? 'calc(100% - 20px)' : 'none',
                                    minWidth: window.innerWidth <= 480 ? 'auto' : '200px',
                                    margin: window.innerWidth <= 480 ? '0 5px' : 
                                           window.innerWidth <= 768 ? '0 10px' : '0',
                                    transition: 'background-color 0.3s ease, transform 0.1s ease',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    boxSizing: 'border-box'
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

