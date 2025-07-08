// Component for score display with stars system like in screenshot
import React from 'react';

const ScoreStars = ({ 
    guessedCount, 
    totalCount,
    gameConfig 
}) => {
    // Calculate progress percentage
    const progress = totalCount > 0 ? (guessedCount / totalCount) : 0;
    
    // Calculate number of stars (out of 5)
    const totalStars = 5;
    const filledStars = Math.floor(progress * totalStars);
    
    // Determine zone name based on game mode
    const getZoneName = () => {
        if (!gameConfig) return "Score";
        
        switch(gameConfig.label) {
            case "Pays d'Europe":
                return "Europe";
            case "Régions de France métropolitaine":
                return "France";
            case "Toutes les régions françaises":
                return "France";
            case "Toutes les régions (carte unique)":
                return "France";
            default:
                return "Score";
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < totalStars; i++) {
            stars.push(
                <span 
                    key={i}
                    style={{
                        color: i < filledStars ? '#FFD700' : '#ddd', // Gold for filled, gray for empty
                        fontSize: '14px',
                        marginRight: '2px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="score-stars-container" style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            width: '80px',
            height: '120px',
            backgroundColor: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 8px',
            border: '2px solid #e0e0e0',
            zIndex: 15
        }}>
            {/* Stars at the top */}
            <div style={{
                marginBottom: '8px',
                fontSize: '16px'
            }}>
                {renderStars()}
            </div>
            
            {/* Zone name in the middle */}
            <div style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#666',
                textAlign: 'center',
                lineHeight: '1.1',
                marginBottom: '6px'
            }}>
                {getZoneName()}
            </div>
            
            {/* Score at the bottom */}
            <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333'
            }}>
                {guessedCount}/{totalCount}
            </div>
        </div>
    );
};

export default ScoreStars; 