import React from 'react';
import { IoTrophy } from "react-icons/io5";

const FastestScore = ({ playerScore = 0, theme }) => {
    // Score du joueur (1 bonne réponse = 10 points)
    const guessedCount = Math.floor(playerScore / 10);
    const total = 10;
    // Système d'étoiles : 1, 4, 7, trophée à 10
    const firstStarFilled = guessedCount >= 1;
    const secondStarFilled = guessedCount >= 4;
    const thirdStarFilled = guessedCount >= 7;
    const trophyFilled = guessedCount >= 10;
    const progress = guessedCount / total;

    const StarIcon = ({ filled }) => (
        <span style={{
            backgroundColor: filled ? '#FFFFFF' : '#D9E2DA',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            margin: '0 8px'
        }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    fill={filled ? '#FFD568' : '#A9BDAD'}
                    stroke={filled ? '#D69E2E' : 'none'}
                    strokeWidth={filled ? '3' : '0'}
                />
            </svg>
        </span>
    );

    const ProgressiveSegment = ({ segmentIndex }) => {
        // Segments à 1, 4, 7, 10
        let shouldShow = false;
        if (segmentIndex === 0 && guessedCount >= 1) shouldShow = true;
        if (segmentIndex === 1 && guessedCount >= 4) shouldShow = true;
        if (segmentIndex === 2 && guessedCount >= 7) shouldShow = true;
        if (segmentIndex === 3 && guessedCount >= 10) shouldShow = true;
        const segmentProgress = Math.min(1, Math.max(0, (progress * 4) - segmentIndex));
        return (
            <div style={{
                width: '160px',
                height: '10px',
                backgroundColor: '#D9E2DA',
                borderRadius: '5px',
                margin: '0 10px',
                overflow: 'hidden',
                position: 'relative',
                opacity: 1,
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    width: `${segmentProgress * 100}%`,
                    height: '100%',
                    background: '#FFD700', // Doré
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                }}></div>
            </div>
        );
    };

    const TrophyIcon = ({ filled }) => (
        <span style={{
            backgroundColor: filled ? '#FFFFFF' : '#D9E2DA',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px',
            transition: 'all 0.3s ease'
        }}>
            <IoTrophy size={20} color={filled ? '#FFD700' : '#A9BDAD'} />
        </span>
    );

    return (
        <div style={{
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 15
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
            }}>
                <StarIcon filled={firstStarFilled} />
                <ProgressiveSegment segmentIndex={0} />
                <StarIcon filled={secondStarFilled} />
                <ProgressiveSegment segmentIndex={1} />
                <StarIcon filled={thirdStarFilled} />
                <ProgressiveSegment segmentIndex={2} />
                <TrophyIcon filled={trophyFilled} />
            </div>
            <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: theme?.colors?.score || '#2C3E50',
                fontFamily: 'monospace',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '1px'
            }}>
                {guessedCount}/10
            </div>
        </div>
    );
};

export default FastestScore; 