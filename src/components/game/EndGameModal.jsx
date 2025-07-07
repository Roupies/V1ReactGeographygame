// Specialized component for end game modal
// Follows Single Responsibility Principle - only handles end game UI
import React from 'react';

const EndGameModal = ({ gameEnded, resetGame, goToHome }) => {
    if (!gameEnded) return null;
    
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '10px' }}>
                <h2>Game Over!</h2>
                <button onClick={resetGame}>Play Again</button>
                <button onClick={goToHome}>Home</button>
            </div>
        </div>
    );
};

export default EndGameModal; 