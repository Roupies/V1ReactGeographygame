// Modular App component - ORCHESTRATION ONLY
// Follows Single Responsibility Principle - only handles orchestration
// Delegates all specialized concerns to focused components and hooks

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MapChart from './components/game/MapChart/MapChart';
import DualMapChart from './components/game/MapChart/DualMapChart';
import { useGameLogic } from './hooks/useGameLogic';
import { useFocusManagement } from './hooks/useFocusManagement';
import { useResponsiveProjection } from './hooks/useResponsiveProjection';
import { useTheme } from './hooks/useTheme';
import { useMultiplayer } from './hooks/useMultiplayer';
import { GAME_MODES } from './data/gameModes';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameHeader from './components/game/GameHeader';
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

// Clean, modular App component
function App() {
    // State management for game mode selection
    const [selectedMode, setSelectedMode] = useState(null);
    const [isMultiplayer, setIsMultiplayer] = useState(false);
    const [showLobby, setShowLobby] = useState(false);
    
    // State for hint popup visibility
    const [showHintPopup, setShowHintPopup] = useState(false);
    
    // Theme management
    const { theme } = useTheme();
    
    // Multiplayer hook
    const multiplayer = useMultiplayer();
    
    // Memoize gameConfig to prevent unnecessary re-renders
    const gameConfig = useMemo(() => {
        console.log('gameConfig calculation - selectedMode:', selectedMode, 'isMultiplayer:', isMultiplayer);
        console.log('GAME_MODES available:', Object.keys(GAME_MODES));
        const config = selectedMode ? GAME_MODES[selectedMode] : null;
        console.log('gameConfig result:', config ? 'defined' : 'null');
        return config;
    }, [selectedMode, isMultiplayer]);

    // Stabilize getName and getAltNames functions to prevent re-renders
    const getName = useMemo(() => {
        return gameConfig?.getName || ((entity) => entity.name);
    }, [gameConfig?.getName]);

    const getAltNames = useMemo(() => {
        return gameConfig?.getAltNames || ((entity) => entity.altNames || []);
    }, [gameConfig?.getAltNames]);

    // Use modular game logic hook with stable functions
    const gameLogic = useGameLogic(
        gameConfig?.entities,
        getName,
        getAltNames
    );

    // Use specialized focus management hook
    const focusManagement = useFocusManagement(selectedMode, gameLogic.gameEnded);

    // Use responsive projection hook
    const projectionConfig = useResponsiveProjection(selectedMode, gameConfig);

    // Initialize game when mode changes - simple version
    useEffect(() => {
        if (selectedMode) {
            gameLogic.initializeGame();
        }
    }, [selectedMode]); // Only depend on selectedMode
    
    // Close hint popup when current country changes
    useEffect(() => {
        setShowHintPopup(false);
    }, [gameLogic.currentCountry]);

    // Stable goToHome function
    const goToHome = useCallback(() => {
        setSelectedMode(null);
        setIsMultiplayer(false);
        setShowLobby(false);
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
    
    // Multiplayer navigation functions
    const handleSelectMultiplayer = useCallback(() => {
        setIsMultiplayer(true);
        setShowLobby(true);
        // Set Europe mode immediately for multiplayer
        setSelectedMode('europe');
    }, []);
    
    const handleBackFromLobby = useCallback(() => {
        setShowLobby(false);
        setIsMultiplayer(false);
    }, []);
    
    const handleCreateRoom = useCallback(async (playerName) => {
        await multiplayer.createRoom(playerName, 'europe');
    }, [multiplayer]);
    
    const handleJoinRoom = useCallback(async (roomId, playerName) => {
        await multiplayer.joinRoom(roomId, playerName);
    }, [multiplayer]);

    // Memorize enhanced actions to prevent unnecessary re-renders
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
            setShowHintPopup(true); // Show the hint popup
            focusManagement.focusInput();
        },
        handleKeyPress: gameLogic.handleKeyPress
    }), [gameLogic.handleGuess, gameLogic.handleSkip, gameLogic.handleHint, gameLogic.handleKeyPress, focusManagement.focusInput]);

    // Determine which map component to use based on game configuration
    const renderMapComponent = () => {
        // Vérification de sécurité avant d'accéder à gameConfig
        if (!gameConfig) {
            return <div className="loading-map">Loading map configuration...</div>;
        }

        // Use DualMapChart for modes with multiple zones
        if (gameConfig?.zones && Array.isArray(gameConfig.zones)) {
            return (
                <DualMapChart 
                    gameConfig={gameConfig}
                    currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentCountry}
                    guessedCountries={isMultiplayer ? multiplayer.gameState.guessedCountries : gameLogic.guessedCountries}
                    projectionConfig={projectionConfig}
                    theme={theme}
                />
            );
        }
        
        // Vérification de sécurité pour les modes à zone unique
        if (!gameConfig.geoJson) {
            return <div className="loading-map">Loading map data...</div>;
        }
        
        // Use standard MapChart for single-zone modes
        return (
            <MapChart 
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentCountry}
                guessedCountries={isMultiplayer ? multiplayer.gameState.guessedCountries : gameLogic.guessedCountries}
                geoJsonPath={gameConfig.geoJson}
                geoIdProperty={gameConfig.geoIdProperty}
                projectionConfig={projectionConfig}
                theme={theme}
            />
        );
    };

    // Show home screen if no mode selected and not in multiplayer flow
    if (!selectedMode && !isMultiplayer) {
        return <HomeScreen 
            onSelectMode={setSelectedMode} 
            onSelectMultiplayer={handleSelectMultiplayer}
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
    
    // If in multiplayer but no solo mode selected and not in lobby, default to Europe
    if (isMultiplayer && !selectedMode && !showLobby) {
        console.log('Setting selectedMode to europe (fallback)');
        setSelectedMode('europe');
        return <div className="loading-map">Loading multiplayer game...</div>;
    }
    
    // Show loading while gameConfig is being set up (but only if we're not in the process of setting selectedMode)
    if (isMultiplayer && !gameConfig && selectedMode) {
        console.log('gameConfig is null but selectedMode is set, showing loading...');
        return <div className="loading-map">Loading game configuration...</div>;
    }

    return (
        <div className="App" style={{
            backgroundColor: theme?.colors?.background || '#ffffff',
            minHeight: '100vh',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Theme toggle button */}
            

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

            {/* Each component has a single responsibility */}
            {!isMultiplayer && (
                <GameHeader 
                    timeLeft={gameLogic.timeLeft}
                    formatTime={gameLogic.formatTime}
                    theme={theme}
                />
            )}

            {gameConfig && (
                <ScoreStars 
                    guessedCountries={isMultiplayer ? multiplayer.gameState.guessedCountries : gameLogic.guessedCountries}
                    gameConfig={gameConfig}
                    theme={theme}
                />
            )}

            <div className="map-container">
                {renderMapComponent()}
            </div>

            <GameControls
                // Game state - use multiplayer state if in multiplayer mode
                gameEnded={isMultiplayer ? multiplayer.gameState.gameEnded : gameLogic.gameEnded}
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentCountry}
                
                // Input state - only show for current player in multiplayer
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
                        // In multiplayer, hints should work for the current player
                        if (multiplayer.isMyTurn) {
                            enhancedActions.handleHint();
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
                
                // Multiplayer-specific props
                isMultiplayer={isMultiplayer}
                isMyTurn={isMultiplayer ? multiplayer.isMyTurn : true}
                disabled={isMultiplayer && !multiplayer.isMyTurn}
            />

            <HintPopup 
                hint={showHintPopup ? gameLogic.hint : null}
                currentCountry={isMultiplayer ? multiplayer.gameState.currentCountry : gameLogic.currentCountry}
                gameConfig={gameConfig}
                onClose={closeHintPopup}
                theme={theme}
            />

            {/* Solo game end modal */}
            {!isMultiplayer && (
                <EndGameModal
                    // Game state
                    gameEnded={gameLogic.gameEnded}
                    guessedCountries={gameLogic.guessedCountries}
                    totalCountries={gameLogic.totalCountries}
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
                    onRestart={multiplayer.restartGame}
                    onLeave={goToHome}
                />
            )}
        </div>
    );
}

export default App;

