// Modular App component - ORCHESTRATION ONLY
// Follows Single Responsibility Principle - only handles orchestration
// Delegates all specialized concerns to focused components and hooks

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MapChart from './components/game/MapChart/MapChart';
import { useGameLogic } from './hooks/useGameLogic';
import { useFocusManagement } from './hooks/useFocusManagement';
import { useResponsiveProjection } from './hooks/useResponsiveProjection';
import { GAME_MODES } from './data/gameModes';
import HomeScreen from './components/HomeScreen';
import GameHeader from './components/game/GameHeader';
import GameControls from './components/game/GameControls';
import EndGameModal from './components/game/EndGameModal';
import './App.css';

// Clean, modular App component
function App() {
    // State management for game mode selection
    const [selectedMode, setSelectedMode] = useState(null);
    
    // Memoize gameConfig to prevent unnecessary re-renders
    const gameConfig = useMemo(() => {
        return selectedMode ? GAME_MODES[selectedMode] : null;
    }, [selectedMode]);

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

    // Stable goToHome function
    const goToHome = useCallback(() => setSelectedMode(null), []);

    // Memorize enhanced actions to prevent unnecessary re-renders
    const enhancedActions = useMemo(() => ({
        handleGuess: () => {
            gameLogic.handleGuess();
            focusManagement.restoreFocus();
        },
        handleSkip: () => {
            gameLogic.handleSkip();
            focusManagement.restoreFocus();
        },
        handleHint: () => {
            gameLogic.handleHint();
            focusManagement.restoreFocus();
        },
        handleKeyPress: gameLogic.handleKeyPress
    }), [gameLogic.handleGuess, gameLogic.handleSkip, gameLogic.handleHint, gameLogic.handleKeyPress, focusManagement.restoreFocus]);

    // Show home screen if no mode selected
    if (!selectedMode) {
        return <HomeScreen onSelectMode={setSelectedMode} />;
    }

    return (
        <div className="App">
            {/* Each component has a single responsibility */}
            <GameHeader 
                timeLeft={gameLogic.timeLeft}
                formatTime={gameLogic.formatTime}
                guessedCount={gameLogic.guessedCountries.length}
                totalCount={gameLogic.totalCountries}
            />

            <div className="map-container">
                <MapChart 
                    currentCountry={gameLogic.currentCountry}
                    guessedCountries={gameLogic.guessedCountries}
                    geoJsonPath={gameConfig.geoJson}
                    geoIdProperty={gameConfig.geoIdProperty}
                    projectionConfig={projectionConfig}
                />
            </div>

            <GameControls
                // Game state
                gameEnded={gameLogic.gameEnded}
                currentCountry={gameLogic.currentCountry}
                
                // Input state
                guessInput={gameLogic.guessInput}
                setGuessInput={gameLogic.setGuessInput}
                feedbackMessage={gameLogic.feedbackMessage}
                hint={gameLogic.hint}
                
                // Enhanced actions (with focus management)
                handleGuess={enhancedActions.handleGuess}
                handleSkip={enhancedActions.handleSkip}
                handleHint={enhancedActions.handleHint}
                handleKeyPress={enhancedActions.handleKeyPress}
                
                // Focus management
                inputRef={focusManagement.inputRef}
                mobileInputRef={focusManagement.mobileInputRef}
                
                // Configuration
                selectedMode={selectedMode}
                gameConfig={gameConfig}
            />

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
        </div>
    );
}

export default App;

