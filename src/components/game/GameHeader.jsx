// Specialized component for game header (timer display only)
// Follows Single Responsibility Principle - only handles timer UI
import React from 'react';

const GameHeader = ({ 
    timeLeft, 
    formatTime
}) => {
    return (
        <div className="game-header">
            {/* Timer display - centered at top like in screenshot */}
            <div className="timer-display" style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                backgroundColor: '#2C3E50',  // Dark blue-gray like screenshot
                padding: '12px 20px', 
                borderRadius: '25px', 
                color: '#FFF', 
                fontWeight: 'bold',
                fontSize: '1.4em', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                minWidth: '120px', 
                textAlign: 'center',
                letterSpacing: '1px',
                fontFamily: 'monospace' // For better time display
            }}>
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default GameHeader; 