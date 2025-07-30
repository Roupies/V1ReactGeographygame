// Mode selection screen component
// Displays available game modes (maps) after choosing Solo or Multiplayer
import React from 'react';
import gameManager from '../data/gameModes';

export default function ModeSelectionScreen({ 
  gameType, // 'solo' or 'multiplayer'
  onSelectMode, 
  onBack 
}) {
  const isMultiplayer = gameType === 'multiplayer';
  const availableModes = isMultiplayer 
    ? Object.keys(gameManager.multiplayerModes)
    : Object.keys(gameManager.soloModes);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#F8F9FA',              // Light background - new charte graphique
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
        maxWidth: '800px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#6C757D',              // Medium gray - new charte
            fontSize: '1.2em',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '8px',           // Rounded corners - new charte
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#495057';
            e.target.style.backgroundColor = '#E9ECEF';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6C757D';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          ← Retour
        </button>
        
        <h1 style={{ 
          color: '#495057',                // Dark gray - new charte
          margin: '0 auto',
          fontSize: window.innerWidth <= 768 ? '1.8em' : '2.2em',
          textAlign: 'center',
          fontWeight: '600'                // Semi-bold - new charte
        }}>
          Choisissez une carte
        </h1>
        
        <div style={{ width: '60px' }}></div> {/* Spacer for centering */}
      </div>

      {/* Game type indicator */}
      <div style={{
        backgroundColor: isMultiplayer ? '#6B9080' : '#A8DADC',  // Sage green for multiplayer, light blue for solo - new charte
        color: isMultiplayer ? 'white' : '#495057',              // White text for multiplayer, dark gray for solo
        padding: '8px 20px',
        borderRadius: '20px',
        marginBottom: '30px',
        fontSize: '1.1em',
        fontWeight: '500'                  // Medium weight - new charte
      }}>
        {isMultiplayer ? '🎮 Mode Multijoueur' : '🎯 Mode Solo'}
      </div>

      {/* Mode selection grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',                       // Increased gap - new charte
        maxWidth: '900px',
        width: '100%'
      }}>
        {availableModes.map(modeKey => {
          const mode = gameManager.getMode(modeKey, isMultiplayer);
          const uiCustomization = gameManager.getUICustomization(modeKey, isMultiplayer);
          
          // New color mapping based on mode
          let buttonColor = '#6B9080'; // Default sage green
          let textColor = 'white';
          
          if (modeKey === 'europe') {
            buttonColor = '#6B9080'; // Sage green
          } else if (modeKey === 'europeRace') {
            buttonColor = '#A8DADC'; // Light blue
            textColor = '#495057';   // Dark gray text
          } else if (modeKey === 'france') {
            buttonColor = '#F4A261'; // Light orange
            textColor = '#495057';   // Dark gray text
          }
          
          return (
            <button
              key={modeKey}
              onClick={() => onSelectMode(modeKey)}
              style={{
                padding: '24px',           // Increased padding - new charte
                fontSize: '1.1em',
                border: 'none',
                borderRadius: '16px',      // More rounded corners - new charte
                backgroundColor: buttonColor,
                color: textColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '120px',        // Increased height - new charte
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  // Subtle shadow - new charte
                fontWeight: '500'          // Medium weight - new charte
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                // Slightly darker shade on hover
                if (buttonColor === '#6B9080') {
                  e.target.style.backgroundColor = '#5A7A6B';
                } else if (buttonColor === '#A8DADC') {
                  e.target.style.backgroundColor = '#95C5C7';
                } else if (buttonColor === '#F4A261') {
                  e.target.style.backgroundColor = '#E89B5A';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                e.target.style.backgroundColor = buttonColor;
              }}
            >
              {uiCustomization.icon && (
                <span style={{ fontSize: '2em', marginBottom: '12px' }}>
                  {uiCustomization.icon}
                </span>
              )}
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                {mode?.label || modeKey}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                {mode?.entities?.length || 0} {mode?.unitLabel || 'entités'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p style={{
        color: '#6C757D',                  // Medium gray - new charte
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '0.9em',
        maxWidth: '600px',
        lineHeight: '1.6'                  // Increased line height - new charte
      }}>
        {isMultiplayer 
          ? 'Jouez à 2 avec tours alternés en temps réel !'
          : 'Jouez seul et améliorez vos connaissances géographiques !'
        }
      </p>
    </div>
  );
} 