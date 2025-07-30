// Specialized component for end game modal with detailed statistics
// Follows Single Responsibility Principle - only handles end game UI
import React from 'react';

const EndGameModal = ({ 
    // Game state
    gameEnded,
    guessedCountries,
    totalCountries,
    gameTimeSeconds,
    timeLeft,
    
    // Statistics  
    totalGuesses,
    hintsUsed,
    skipsUsed,
    accuracy,
    
    // Configuration
    gameConfig,
    
    // Actions
    resetGame,
    goToHome,
    
    // Utilities
    formatTime
}) => {
    if (!gameEnded) return null;

    // Calculate game duration
    // ✅ CORRIGÉ : Utilise gameTimeSeconds au lieu de valeur hardcodée
    const defaultTimeSeconds = gameTimeSeconds || 240;
    const gameDuration = defaultTimeSeconds - timeLeft;
    const finalTime = formatTime ? formatTime(gameDuration) : `${Math.floor(gameDuration / 60)}:${(gameDuration % 60).toString().padStart(2, '0')}`;
    
    // Calculate percentage
    const percentage = totalCountries > 0 ? Math.round((guessedCountries.length / totalCountries) * 100) : 0;
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>🎉 Partie terminée !</h2>
                
                <div className="stats-section">
                    <h3>📊 Résultats</h3>
                    <div className="stat-item">
                        <span className="stat-label">Score :</span>
                        <span className="stat-value">{guessedCountries.length}/{totalCountries} ({percentage}%)</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Temps :</span>
                        <span className="stat-value">{finalTime}</span>
                    </div>
                    {accuracy !== undefined && (
                        <div className="stat-item">
                            <span className="stat-label">Précision :</span>
                            <span className="stat-value">{accuracy}%</span>
                        </div>
                    )}
                </div>

                <div className="stats-section">
                    <h3>🎯 Statistiques</h3>
                    <div className="stat-item">
                        <span className="stat-label">Tentatives totales :</span>
                        <span className="stat-value">{totalGuesses || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Indices utilisés :</span>
                        <span className="stat-value">{hintsUsed || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Entités passées :</span>
                        <span className="stat-value">{skipsUsed || 0}</span>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-primary" onClick={resetGame}>
                        🔄 Rejouer
                    </button>
                    <button className="btn-secondary" onClick={goToHome}>
                        🏠 Accueil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndGameModal; 