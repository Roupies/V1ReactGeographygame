// Specialized component for game header (timer display only)
// Follows Single Responsibility Principle - only handles timer UI
import React from 'react';

const GameHeader = ({ 
    timeLeft, 
    formatTime,
    theme
}) => {
    return (
        <div className="game-header">
            {/* Timer display - themed */}
            <div className="timer-display" style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                color: theme?.colors?.timer || '#2C3E50',
                fontWeight: '900',
                fontSize: '1.8em',
                textAlign: 'center',
                letterSpacing: '1px',
                fontFamily: 'monospace',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default GameHeader; 