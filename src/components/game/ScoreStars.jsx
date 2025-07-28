// Component for stylized score display with 3 stars and trophy cup, separated by horizontal segments
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { IoIosTrophy } from "react-icons/io";

const ScoreStars = ({ guessedCountries, gameConfig }) => {
    const { theme } = useTheme();
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState(4 * 60); // 4 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    
    // Timer effect
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);
    
    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    if (!gameConfig) return null;
    if (!gameConfig.entities) return null;
    
    const totalCountries = gameConfig.entities.length;
    if (totalCountries === 0) return null;
    
    const guessedCount = guessedCountries.length;
    const oneThird = Math.ceil(totalCountries / 3);
    const twoThirds = Math.ceil((totalCountries * 2) / 3);
    
    // Progression logic
    const firstStarFilled = guessedCount >= 1;
    const secondStarFilled = guessedCount >= oneThird;
    const thirdStarFilled = guessedCount >= twoThirds;
    const trophyFilled = guessedCount >= totalCountries;
    
    // Calculate progress for each segment
    const getSegmentProgress = (segmentIndex) => {
        if (segmentIndex === 0) {
            // First segment: 0 to 1/3
            return Math.min(1, (guessedCount / oneThird));
        } else if (segmentIndex === 1) {
            // Second segment: 1/3 to 2/3
            return Math.min(1, Math.max(0, (guessedCount - oneThird) / (twoThirds - oneThird)));
        } else if (segmentIndex === 2) {
            // Third segment: 2/3 to 100%
            return Math.min(1, Math.max(0, (guessedCount - twoThirds) / (totalCountries - twoThirds)));
        }
        return 0;
    };
    
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            padding: '15px',
            borderRadius: '15px',
            minWidth: '400px'
        }}>
            {/* Timer */}
                            <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0px'
                }}>
                <div style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    color: '#1e3241',
                    fontFamily: 'Arial, sans-serif',
                    transition: 'all 0.3s ease',
                    letterSpacing: '-3px',
                    textAlign: 'center',
                    lineHeight: '1',
                    width: 'fit-content'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>
            
            {/* Stars and Trophy with Progress Bars */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>
                {/* First Star */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: firstStarFilled ? (theme?.colors?.starBgFilled || '#FFFFFF') : (theme?.colors?.starBgEmpty || '#D9E2DA'),
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: firstStarFilled ? '0 0 15px rgba(255, 213, 104, 0.3)' : 'none',
                    border: firstStarFilled ? '2px solid rgba(214, 158, 46, 0.3)' : '2px solid #e5e7eb'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                            fill={firstStarFilled ? (theme?.colors?.starsFilled || '#FFD568') : (theme?.colors?.starsEmpty || '#A9BDAD')}
                            stroke={firstStarFilled ? (theme?.colors?.trophyStroke || '#D69E2E') : 'none'}
                            strokeWidth={firstStarFilled ? '1' : '0'}
                        />
                    </svg>
                </div>
                
                {/* First Progress Bar */}
                <div style={{
                    width: '120px',
                    height: '8px',
                    backgroundColor: theme?.colors?.progressBg || '#D9E2DA',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${getSegmentProgress(0) * 100}%`,
                        height: '100%',
                        backgroundColor: theme?.colors?.progressFill || '#089DC0',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shimmer 2s infinite'
                        }} />
                    </div>
                </div>
                
                {/* Second Star */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: secondStarFilled ? (theme?.colors?.starBgFilled || '#FFFFFF') : (theme?.colors?.starBgEmpty || '#D9E2DA'),
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: secondStarFilled ? '0 0 15px rgba(255, 213, 104, 0.3)' : 'none',
                    border: secondStarFilled ? '2px solid rgba(214, 158, 46, 0.3)' : '2px solid #e5e7eb'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                            fill={secondStarFilled ? (theme?.colors?.starsFilled || '#FFD568') : (theme?.colors?.starsEmpty || '#A9BDAD')}
                            stroke={secondStarFilled ? (theme?.colors?.trophyStroke || '#D69E2E') : 'none'}
                            strokeWidth={secondStarFilled ? '1' : '0'}
                        />
                    </svg>
                </div>
                
                {/* Second Progress Bar */}
                <div style={{
                    width: '120px',
                    height: '8px',
                    backgroundColor: theme?.colors?.progressBg || '#D9E2DA',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${getSegmentProgress(1) * 100}%`,
                        height: '100%',
                        backgroundColor: theme?.colors?.progressFill || '#089DC0',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shimmer 2s infinite'
                        }} />
                    </div>
                </div>
                
                {/* Third Star */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: thirdStarFilled ? (theme?.colors?.starBgFilled || '#FFFFFF') : (theme?.colors?.starBgEmpty || '#D9E2DA'),
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: thirdStarFilled ? '0 0 15px rgba(255, 213, 104, 0.3)' : 'none',
                    border: thirdStarFilled ? '2px solid rgba(214, 158, 46, 0.3)' : '2px solid #e5e7eb'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                            fill={thirdStarFilled ? (theme?.colors?.starsFilled || '#FFD568') : (theme?.colors?.starsEmpty || '#A9BDAD')}
                            stroke={thirdStarFilled ? (theme?.colors?.trophyStroke || '#D69E2E') : 'none'}
                            strokeWidth={thirdStarFilled ? '1' : '0'}
                        />
                    </svg>
                </div>
                
                {/* Third Progress Bar */}
                <div style={{
                    width: '120px',
                    height: '8px',
                    backgroundColor: theme?.colors?.progressBg || '#D9E2DA',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${getSegmentProgress(2) * 100}%`,
                        height: '100%',
                        backgroundColor: theme?.colors?.progressFill || '#089DC0',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shimmer 2s infinite'
                        }} />
                    </div>
                </div>
                
                {/* Trophy */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: trophyFilled ? (theme?.colors?.starBgFilled || '#FFFFFF') : (theme?.colors?.starBgEmpty || '#D9E2DA'),
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: trophyFilled ? '0 0 15px rgba(255, 213, 104, 0.3)' : 'none',
                    border: trophyFilled ? '2px solid rgba(214, 158, 46, 0.3)' : '2px solid #e5e7eb'
                }}>
                    <IoIosTrophy 
                        size={20}
                        color={trophyFilled ? (theme?.colors?.trophyFilled || '#FFD568') : (theme?.colors?.trophyEmpty || '#A9BDAD')}
                    />
                </div>
            </div>
            
            {/* Progress Text */}
            <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                textAlign: 'center',
                fontStyle: 'italic',
                marginTop: '-5px'
            }}>
                {guessedCount}/{totalCountries}
            </div>
        </div>
    );
};

export default ScoreStars; 