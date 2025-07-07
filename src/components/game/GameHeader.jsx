// Specialized component for game header (timer and score display)
// Follows Single Responsibility Principle - only handles header UI
import React from 'react';

const GameHeader = ({ 
    timeLeft, 
    formatTime, 
    guessedCount, 
    totalCount 
}) => {
    return (
        <div className="game-header">
            <h1></h1>
            
            {/* Timer display - positioned absolutely for consistent placement */}
            <div className="timer-display" style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '25%', 
                transform: 'translateX(-50%)',
                backgroundColor: '#17A2B8',  // Bootstrap info color
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
            
            {/* Score display - shows progress towards completion */}
            <div className="score-display" style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '75%', 
                transform: 'translateX(-50%)',
                backgroundColor: '#4CAF50',  // Material Design green
                padding: '10px 15px', 
                borderRadius: '15px', 
                color: '#FFF', 
                fontWeight: 'bold',
                fontSize: '1.2em',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                {/* Responsive text: abbreviated on mobile, full on desktop */}
                {window.innerWidth < 1024 
                    ? `${guessedCount}/${totalCount}` 
                    : `Score: ${guessedCount} / ${totalCount}`
                }
            </div>
        </div>
    );
};

export default GameHeader; 