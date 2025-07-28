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
      background: '#183040',
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
            color: '#ccc',
            fontSize: '1.2em',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '5px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.color = 'white';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#ccc';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          ← Retour
        </button>
        
        <h1 style={{ 
          color: 'white', 
          margin: '0 auto',
          fontSize: window.innerWidth <= 768 ? '1.8em' : '2.2em',
          textAlign: 'center'
        }}>
          Choisissez une carte
        </h1>
        
        <div style={{ width: '60px' }}></div> {/* Spacer for centering */}
      </div>

      {/* Game type indicator */}
      <div style={{
        backgroundColor: isMultiplayer ? '#28a745' : '#4169E1',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '20px',
        marginBottom: '30px',
        fontSize: '1.1em',
        fontWeight: 'bold'
      }}>
        {isMultiplayer ? '🎮 Mode Multijoueur' : '🎯 Mode Solo'}
      </div>

      {/* Mode selection grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '900px',
        width: '100%'
      }}>
        {availableModes.map(modeKey => {
          const mode = gameManager.getMode(modeKey, isMultiplayer);
          const uiCustomization = gameManager.getUICustomization(modeKey, isMultiplayer);
          
          return (
            <button
              key={modeKey}
              onClick={() => onSelectMode(modeKey)}
              style={{
                padding: '20px',
                fontSize: '1.1em',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: uiCustomization.primaryColor || '#4169E1',
                background: uiCustomization.buttonGradient || uiCustomization.primaryColor || '#4169E1',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 4px 15px ${uiCustomization.primaryColor || '#4169E1'}30`
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = `0 8px 25px ${uiCustomization.primaryColor || '#4169E1'}50`;
                e.target.style.filter = 'brightness(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 15px ${uiCustomization.primaryColor || '#4169E1'}30`;
                e.target.style.filter = 'brightness(1)';
              }}
            >
              {uiCustomization.icon && (
                <span style={{ fontSize: '2em', marginBottom: '10px' }}>
                  {uiCustomization.icon}
                </span>
              )}
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {mode?.label || modeKey}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                {mode?.entities?.length || 0} {mode?.unitLabel || 'entités'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p style={{
        color: '#aaa',
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '0.9em',
        maxWidth: '600px',
        lineHeight: '1.5'
      }}>
        {isMultiplayer 
          ? 'Jouez à 2 avec tours alternés en temps réel !'
          : 'Jouez seul et améliorez vos connaissances géographiques !'
        }
      </p>
    </div>
  );
} 