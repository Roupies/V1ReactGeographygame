// Component for stylized score display with 3 stars and trophy cup, separated by horizontal segments
import React from 'react';

const ScoreStars = ({ 
    guessedCountries, 
    gameConfig,
    theme 
}) => {
    if (!gameConfig) return null;

    const totalCountries = gameConfig.entities?.length || 0;
    const guessedCount = guessedCountries.length;
    
    // Calculate progress in thirds
    const oneThird = Math.ceil(totalCountries / 3);
    const twoThirds = Math.ceil((totalCountries * 2) / 3);
    
    // Determine which elements are filled based on thirds
    const firstStarFilled = guessedCount >= 1; // First star lights up after first guess
    const secondStarFilled = guessedCount >= oneThird;
    const thirdStarFilled = guessedCount >= twoThirds;
    const trophyFilled = guessedCount >= totalCountries; // Trophy only when 100% complete
    
    // Calculate overall progress percentage for progress line
    const progress = totalCountries > 0 ? (guessedCount / totalCountries) : 0;
    
    // Trophy SVG component with themed colors and round border like stars
    const TrophyIcon = ({ filled }) => (
        <span style={{
            backgroundColor: '#D9E2DA', // Bordure ronde comme les étoiles
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px', // Même espacement que les étoiles
            transition: 'all 0.3s ease'
        }}>
            <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{
                    filter: filled ? `drop-shadow(0 2px 4px rgba(3, 157, 191, 0.4))` : 'none'
                }}
            >
                {/* Coupe élégante avec forme de calice */}
                <path 
                    d="M7 6C7 4.9 7.9 4 9 4H15C16.1 4 17 4.9 17 6V10C17 11.1 16.1 12 15 12H9C7.9 12 7 11.1 7 10V6Z" 
                    fill={filled ? '#039DBF' : '#039DBF'}
                />
                
                {/* Tige de la coupe */}
                <rect 
                    x="10" 
                    y="12" 
                    width="4" 
                    height="4" 
                    fill={filled ? '#039DBF' : '#039DBF'}
                    rx="1"
                />
                
                {/* Base de la coupe */}
                <rect 
                    x="8" 
                    y="16" 
                    width="8" 
                    height="2" 
                    fill={filled ? '#039DBF' : '#039DBF'}
                    rx="1"
                />
                
                {/* Poignées élégantes */}
                <path 
                    d="M6 8C6 7.45 6.45 7 7 7H8V9C8 9.55 7.55 10 7 10C6.45 10 6 9.55 6 9V8Z" 
                    fill={filled ? '#039DBF' : '#039DBF'}
                />
                <path 
                    d="M16 8C16 7.45 16.45 7 17 7H18V9C18 9.55 17.55 10 17 10C16.45 10 16 9.55 16 9V8Z" 
                    fill={filled ? '#039DBF' : '#039DBF'}
                />
                
                {/* Étoile brillante quand rempli */}
                {filled && (
                    <path 
                        d="M12 7L13 9L15 9L13.5 10.5L14 12.5L12 11.5L10 12.5L10.5 10.5L9 9L11 9L12 7Z" 
                        fill="#FFD700"
                    />
                )}
            </svg>
        </span>
    );

    // Star component with themed styling
    const StarIcon = ({ filled }) => (
        <span style={{
            backgroundColor: filled ? '#FFFFFF' : '#D9E2DA', // Fond blanc quand remplie
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            margin: '0 8px' // Espacement réduit entre les étoiles
        }}>
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
            >
                <path 
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    fill={filled ? '#FFD568' : '#A9BDAD'}
                    stroke={filled ? '#D69E2E' : 'none'}
                    strokeWidth={filled ? '3' : '0'}
                />
            </svg>
        </span>
    );

    // Progressive horizontal segment that "pops" when tier is reached
    const ProgressiveSegment = ({ segmentIndex }) => {
        // Calculate progress for this specific segment (0, 1, 2, 3 for the 4 segments)
        const segmentProgress = Math.min(1, Math.max(0, (progress * 4) - segmentIndex));
        
        // Determine if this segment should be visible
        let shouldShow = false;
        if (segmentIndex === 0 && guessedCount >= 1) shouldShow = true; // First segment after first answer
        if (segmentIndex === 1 && guessedCount >= oneThird) shouldShow = true; // Second segment after 1/3
        if (segmentIndex === 2 && guessedCount >= twoThirds) shouldShow = true; // Third segment after 2/3
        if (segmentIndex === 3 && guessedCount >= totalCountries) shouldShow = true; // Fourth segment when trophy is earned
        
        return (
            <div style={{
                width: '160px',
                height: '10px',
                backgroundColor: '#D9E2DA', // Couleur de fond des barres
                borderRadius: '5px',
                margin: '0 10px',
                overflow: 'hidden',
                position: 'relative',
                opacity: 1, // Toujours visible
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    width: `${segmentProgress * 100}%`,
                    height: '100%',
                    background: '#039DBF', // Couleur de progression
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                }}>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'absolute',
            top: '70px', // Légèrement remonté pour éviter l'empiètement
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 15
        }}>
            {/* Stars and trophy row with wide progress bars */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px' // Réduit pour compacter
            }}>
                {/* First star */}
                <StarIcon filled={firstStarFilled} />
                
                <ProgressiveSegment segmentIndex={0} />
                
                {/* Second star */}
                <StarIcon filled={secondStarFilled} />
                
                <ProgressiveSegment segmentIndex={1} />
                
                {/* Third star */}
                <StarIcon filled={thirdStarFilled} />
                
                <ProgressiveSegment segmentIndex={2} />
                
                {/* Trophy */}
                <TrophyIcon filled={trophyFilled} />
            </div>
            
            {/* Score counter - themed */}
            <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: theme?.colors?.score || '#2C3E50',
                fontFamily: 'monospace',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '1px'
            }}>
                {guessedCount}/{totalCountries}
            </div>
        </div>
    );
};

export default ScoreStars; 