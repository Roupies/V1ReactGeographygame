// Modular App component - ORCHESTRATION ONLY
// Follows Single Responsibility Principle - only handles orchestration
// Delegates all specialized concerns to focused components and hooks
// Now uses GameManager for all game mode logic

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MapChart from './components/game/MapChart/MapChart';
import DualMapChart from './components/game/MapChart/DualMapChart';
import { useGameLogic } from './hooks/useGameLogic';
import { useFocusManagement } from './hooks/useFocusManagement';
import { useResponsiveProjection } from './hooks/useResponsiveProjection';
import { useTheme } from './hooks/useTheme';
import { useMultiplayer } from './hooks/useMultiplayer';
import gameManager from './data/gameModes';
import HomeScreen from './components/HomeScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import LobbyScreen from './components/LobbyScreen';
import GameControls from './components/game/GameControls';
import EndGameModal from './components/game/EndGameModal';
import ScoreStars from './components/game/ScoreStars';
import HintPopup from './components/game/HintPopup';

import { 
  WaitingRoom, 
  TurnIndicator, 
  PlayerScores, 
  GameMessages, 
  RoomInfo, 
  MultiplayerEndModal 
} from './components/game/MultiplayerUI';
import './App.css';

// Clean, modular App component using GameManager
function App() {
    // State management for game mode selection
    const [selectedMode, setSelectedMode] = useState(null);
    const [isMultiplayer, setIsMultiplayer] = useState(false);
    const [showLobby, setShowLobby] = useState(false);
    const [showModeSelection, setShowModeSelection] = useState(false);
    const [gameType, setGameType] = useState(null); // 'solo' or 'multiplayer'
    
    // State for hint popup visibility
    const [showHintPopup, setShowHintPopup] = useState(false);
    
    // Theme management
    const { theme } = useTheme(selectedMode);
    
    // Multiplayer hook
    const multiplayer = useMultiplayer();
    
    // Network status for mobile optimization
    // ❌ SUPPRIMÉ : Code d'optimisation mobile indésirable
    
    // Clean and focused game configuration
    const gameConfig = useMemo(() => {
        return selectedMode ? gameManager.getMode(selectedMode, isMultiplayer) : null;
    }, [selectedMode, isMultiplayer]);

    // Preload GeoJSON files for better performance (simple version)
    useEffect(() => {
        const preloadFiles = ['/geojson/europe.json', '/geojson/regions.geojson'];
        
        if (!window.geoJSONCache) {
            window.geoJSONCache = new Map();
        }

        preloadFiles.forEach(file => {
            if (!window.geoJSONCache.has(file)) {
                fetch(file)
                    .then(response => response.json())
                    .then(data => {
                        window.geoJSONCache.set(file, data);
                    })
                    .catch(err => console.warn('Preload failed:', file, err));
            }
        });
    }, []);

    // Use modular game logic hook with GameManager
    // ✅ NOUVEAU : Passer serverTimeLeft pour synchronisation timer multiplayer
    const gameLogic = useGameLogic(
        selectedMode, 
        isMultiplayer, 
        isMultiplayer ? multiplayer.gameState.gameTimeLeft : null
    );

    // Use specialized focus management hook
    const focusManagement = useFocusManagement(selectedMode, gameLogic.gameEnded);

    // Use responsive projection hook with GameManager data
    const projectionConfig = useResponsiveProjection(selectedMode, gameConfig);

    // Close hint popup when current entity changes
    useEffect(() => {
        setShowHintPopup(false);
    }, [gameLogic.currentEntity]);

    // Update selected mode when receiving game mode from server in multiplayer
    useEffect(() => {
        if (isMultiplayer && multiplayer.gameState.gameMode && !selectedMode) {
            setSelectedMode(multiplayer.gameState.gameMode);
        }
    }, [isMultiplayer, multiplayer.gameState.gameMode, selectedMode]);

    // Stable goToHome function
    const goToHome = useCallback(() => {
        setSelectedMode(null);
        setIsMultiplayer(false);
        setShowLobby(false);
        setShowModeSelection(false);
        setGameType(null);
        if (multiplayer.isConnected) {
            multiplayer.leaveRoom();
        }
        // Reset any multiplayer state
        if (multiplayer.gameState.gameStarted) {
            multiplayer.restartGame();
        }
    }, [multiplayer]);
    
    // Function to close hint popup
    const closeHintPopup = useCallback(() => setShowHintPopup(false), []);
    
    // Navigation functions for new flow
    const handleSelectSolo = useCallback(() => {
        setGameType('solo');
        setShowModeSelection(true);
    }, []);
    
    const handleSelectMultiplayer = useCallback(() => {
        setGameType('multiplayer');
        setShowModeSelection(true);
    }, []);
    
    const handleBackFromModeSelection = useCallback(() => {
        setShowModeSelection(false);
        setGameType(null);
    }, []);
    
    const handleSelectMode = useCallback((modeKey) => {
        setSelectedMode(modeKey);
        setShowModeSelection(false);
        
        if (gameType === 'multiplayer') {
            setIsMultiplayer(true);
            setShowLobby(true);
        }
    }, [gameType]);
    
    // Multiplayer navigation functions
    const handleBackFromLobby = useCallback(() => {
        setShowLobby(false);
        setIsMultiplayer(false);
        setSelectedMode(null);
    }, []);
    
    // Function to handle restart from multiplayer end game modal
    const handleMultiplayerRestart = useCallback(() => {
        // ✅ NOUVEAU : Restart intelligent
        const activePlayers = Object.values(multiplayer.gameState.players).filter(p => p && p.id);
        const hasEnoughPlayers = activePlayers.length >= 2;
        
        if (hasEnoughPlayers && multiplayer.isConnected) {
            // ✅ Assez de joueurs encore connectés = restart direct
            console.log('🔄 Restart direct avec', activePlayers.length, 'joueurs');
            multiplayer.restartGame();
        } else {
            // ✅ Pas assez de joueurs = retour au mode selection
            console.log('⬅️ Retour mode selection (joueurs:', activePlayers.length, ')');
            setSelectedMode(null);
            setIsMultiplayer(false);
            setShowLobby(false);
            setShowModeSelection(false);
            setGameType('multiplayer');
            setShowModeSelection(true);
            if (multiplayer.isConnected) {
                multiplayer.leaveRoom();
            }
        }
    }, [multiplayer]);
    
    // Legacy function for back compatibility
    const handleBackToMultiplayerMode = useCallback(() => {
        setSelectedMode(null);
        setIsMultiplayer(false);
        setShowLobby(false);
        setShowModeSelection(false);
        setGameType('multiplayer');
        setShowModeSelection(true);
        if (multiplayer.isConnected) {
            multiplayer.leaveRoom();
        }
    }, [multiplayer]);
    
    const handleCreateRoom = useCallback(async (playerName, gameMode) => {
        await multiplayer.createRoom(playerName, gameMode);
        setSelectedMode(gameMode); // Set the selected mode
    }, [multiplayer]);
    
    const handleJoinRoom = useCallback(async (roomId, playerName) => {
        await multiplayer.joinRoom(roomId, playerName);
        // Mode will be set when we receive game state from server
    }, [multiplayer]);

    // Enhanced actions using GameManager
    const enhancedActions = useMemo(() => ({
        handleGuess: () => {
            gameLogic.handleGuess();
            focusManagement.focusInput();
        },
        handleSkip: () => {
            gameLogic.handleSkip();
            focusManagement.focusInput();
        },
        handleHint: () => {
            gameLogic.handleHint();
            setShowHintPopup(true);
            focusManagement.focusInput();
        },
        handleKeyPress: gameLogic.handleKeyPress
    }), [gameLogic.handleGuess, gameLogic.handleSkip, gameLogic.handleHint, gameLogic.handleKeyPress, focusManagement.focusInput]);

    // Determine which map component to use based on GameManager configuration
    const renderMapComponent = () => {
        if (!gameConfig) {
            return <div className="loading-map">Loading map configuration...</div>;
        }

        // Use DualMapChart for modes with multiple zones (from GameManager)
        if (gameConfig.zones && Array.isArray(gameConfig.zones)) {
            return (
                <DualMapChart 
                    gameConfig={gameConfig}
                    currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentEntity}
                    guessedCountries={isMultiplayer ? multiplayer.gameState.guessedCountries : gameLogic.guessedEntities}
                    projectionConfig={projectionConfig}
                    theme={theme}
                />
            );
        }
        
        // Use standard MapChart for single-zone modes
        const geoJsonPath = gameManager.getGeoJsonPath(selectedMode, isMultiplayer);
        if (!geoJsonPath) {
            return <div className="loading-map">Loading map data...</div>;
        }
        
        return (
            <MapChart 
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentEntity}
                guessedCountries={isMultiplayer ? multiplayer.gameState.guessedCountries : gameLogic.guessedEntities}
                geoJsonPath={geoJsonPath}
                geoIdProperty={gameConfig.geoIdProperty}
                projectionConfig={projectionConfig}
                theme={theme}
                gameConfig={gameConfig} // ✅ AJOUTÉ : Pour GameManager
                selectedMode={selectedMode} // ✅ AJOUTÉ : Pour GameManager
                isMultiplayer={isMultiplayer} // ✅ AJOUTÉ : Pour GameManager
            />
        );
    };

    // Show home screen if no mode selected and not in any flow
    if (!selectedMode && !isMultiplayer && !showModeSelection) {
        return <HomeScreen 
            onSelectMode={handleSelectSolo} 
            onSelectMultiplayer={handleSelectMultiplayer}
        />;
    }
    
    // Show mode selection screen
    if (showModeSelection && gameType) {
        return <ModeSelectionScreen
            gameType={gameType}
            onSelectMode={handleSelectMode}
            onBack={handleBackFromModeSelection}
        />;
    }
    
    // Show lobby screen for multiplayer
    if (isMultiplayer && showLobby && !multiplayer.isConnected) {
        return <LobbyScreen 
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onBack={handleBackFromLobby}
            isConnecting={multiplayer.isConnecting}
            connectionError={multiplayer.connectionError}
            selectedMode={selectedMode}
        />;
    }
    
    // Show waiting room if connected but game not started
    if (isMultiplayer && multiplayer.isConnected && !multiplayer.gameState.gameStarted) {
        return <WaitingRoom
            gameState={multiplayer.gameState}
            currentPlayer={multiplayer.currentPlayer}
            onReady={multiplayer.readyUp}
            onLeave={goToHome}
            roomId={multiplayer.room?.id}
        />;
    }
    
    // If in multiplayer but no mode selected and not in lobby, default to Europe
    if (isMultiplayer && !selectedMode && !showLobby) {
        setSelectedMode('europe');
        return <div className="loading-map">Loading multiplayer game...</div>;
    }
    
    // Show loading while gameConfig is being set up
    if (isMultiplayer && !gameConfig && selectedMode) {
        return <div className="loading-map">Loading game configuration...</div>;
    }

    return (
        <div className="App" style={{
            backgroundColor: theme?.colors?.background || '#ffffff',
            minHeight: '100vh',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Multiplayer-specific UI components */}
            {isMultiplayer && multiplayer.isConnected && (
                <>
                    <RoomInfo 
                        room={multiplayer.room}
                        onLeave={goToHome}
                    />
                    <TurnIndicator
                        gameState={multiplayer.gameState}
                        isMyTurn={multiplayer.isMyTurn}
                        currentPlayer={multiplayer.currentPlayer}
                        isRaceMode={multiplayer.isRaceMode}
                    />
                    <PlayerScores
                        gameState={multiplayer.gameState}
                        currentPlayer={multiplayer.currentPlayer}
                    />
                    <GameMessages
                        messages={multiplayer.gameMessages}
                        onSendMessage={multiplayer.sendChatMessage}
                        currentPlayer={multiplayer.currentPlayer}
                    />
                </>
            )}

            {/* Game header and progress */}
            {/* GameHeader supprimé pour éliminer la barre grise */}


            
            {selectedMode && gameConfig && (
                <ScoreStars 
                    guessedCountries={isMultiplayer ? (Array.isArray(multiplayer.gameState.guessedCountries) ? multiplayer.gameState.guessedCountries : []) : gameLogic.guessedEntities}
                    gameConfig={gameConfig}
                    theme={theme}
                    // ✅ NOUVEAU : Timer unifié depuis gameLogic (gère automatiquement solo/multi)
                    gameTimeLeft={gameLogic.timer.timeLeft}
                    isMultiplayer={isMultiplayer}
                />
            )}

            {/* Map visualization */}
            {renderMapComponent()}

            {/* Game controls */}
            <GameControls
                // Game state
                gameEnded={isMultiplayer ? multiplayer.gameState.gameEnded : gameLogic.gameEnded}
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentEntity}
                guessedCount={isMultiplayer ? (Array.isArray(multiplayer.gameState.guessedCountries) ? multiplayer.gameState.guessedCountries.length : 0) : gameLogic.guessedEntities.length}
                totalCount={isMultiplayer ? 
                    (gameConfig?.entities?.length || 0) : 
                    gameLogic.totalEntities
                }
                
                // Input handling
                guessInput={isMultiplayer ? (multiplayer.isMyTurn ? gameLogic.guessInput : '') : gameLogic.guessInput}
                setGuessInput={gameLogic.setGuessInput}
                feedbackMessage={gameLogic.feedbackMessage}
                hint={gameLogic.hint}
                isShaking={gameLogic.isShaking}
                
                // Enhanced actions - modify for multiplayer
                handleGuess={isMultiplayer ? 
                    () => {
                        if (multiplayer.isMyTurn && gameLogic.guessInput.trim()) {
                            multiplayer.makeGuess(gameLogic.guessInput.trim());
                            gameLogic.setGuessInput('');
                        }
                    } : 
                    enhancedActions.handleGuess
                }
                handleSkip={isMultiplayer ? 
                    () => {
                        if (multiplayer.isMyTurn) {
                            multiplayer.skipCountry();
                        }
                    } : 
                    enhancedActions.handleSkip
                }
                handleHint={isMultiplayer ? 
                    () => {
                        if (multiplayer.isMyTurn && multiplayer.gameState.currentCountry) {
                            enhancedActions.handleHint(multiplayer.gameState.currentCountry);
                        }
                    } : 
                    enhancedActions.handleHint
                }
                handleKeyPress={isMultiplayer ?
                    (e) => {
                        if (e.key === 'Enter' && multiplayer.isMyTurn && gameLogic.guessInput.trim()) {
                            multiplayer.makeGuess(gameLogic.guessInput.trim());
                            gameLogic.setGuessInput('');
                        }
                    } :
                    enhancedActions.handleKeyPress
                }
                
                // Focus management
                inputRef={focusManagement.inputRef}
                mobileInputRef={focusManagement.mobileInputRef}
                
                // Configuration
                selectedMode={selectedMode}
                gameConfig={gameConfig}
                theme={theme}
                gameManager={gameManager}
                
                // Multiplayer-specific props
                isMultiplayer={isMultiplayer}
                isMyTurn={isMultiplayer ? multiplayer.isMyTurn : true}
                disabled={isMultiplayer && !multiplayer.isMyTurn}
            />

            <HintPopup 
                hint={showHintPopup ? gameLogic.hint : null}
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentEntity}
                gameConfig={gameConfig}
                onClose={closeHintPopup}
                theme={theme}
            />

            {/* Solo game end modal */}
            {!isMultiplayer && (
                <EndGameModal
                    // Game state
                    gameEnded={gameLogic.gameEnded}
                    guessedCountries={gameLogic.guessedEntities}
                    totalCountries={gameLogic.totalEntities}
                    gameTimeSeconds={gameLogic.gameTimeSeconds}
                    timeLeft={gameLogic.timeLeft}
                    
                    // Statistics
                    totalGuesses={gameLogic.totalGuesses}
                    hintsUsed={gameLogic.hintsUsed}
                    skipsUsed={gameLogic.skipsUsed}
                    accuracy={gameLogic.accuracy}
                    
                    // Configuration
                    gameConfig={gameConfig}
                    
                    // Actions
                    resetGame={gameLogic.resetGame}
                    goToHome={goToHome}
                    
                    // Utilities
                    formatTime={gameLogic.formatTime}
                />
            )}

            {/* Multiplayer game end modal */}
            {isMultiplayer && (
                <MultiplayerEndModal
                    lastAction={multiplayer.lastAction}
                    gameState={multiplayer.gameState}
                    onRestart={handleMultiplayerRestart}
                    onLeave={goToHome}
                />
            )}
        </div>
    );
}

export default App;

